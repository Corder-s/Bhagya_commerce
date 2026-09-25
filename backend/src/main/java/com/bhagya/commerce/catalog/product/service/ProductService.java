package com.bhagya.commerce.catalog.product.service;

import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.domain.ProductStatus;
import com.bhagya.commerce.catalog.product.dto.ProductCreateRequest;
import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.catalog.product.dto.ProductUpdateRequest;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.api.PageResponse;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    private static final Duration PRODUCT_CACHE_TTL = Duration.ofHours(24);
    private static final Duration SEARCH_CACHE_TTL = Duration.ofMinutes(15);

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final OrganizationRepository organizationRepository;
    private final CacheService cacheService;

    public ProductService(
        ProductRepository productRepository,
        StoreRepository storeRepository,
        OrganizationRepository organizationRepository,
        CacheService cacheService
    ) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.organizationRepository = organizationRepository;
        this.cacheService = cacheService;
    }

    public PageResponse<ProductResponse> searchProducts(
        String query,
        String category,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String sort,
        int page,
        int size
    ) {
        List<Product> all = productRepository.findAll().stream()
            .filter(p -> p.getStatus() == ProductStatus.PUBLISHED)
            .filter(p -> {
                if (query == null || query.isBlank()) return true;
                String q = query.toLowerCase();
                return p.getName().toLowerCase().contains(q) ||
                    (p.getBlurb() != null && p.getBlurb().toLowerCase().contains(q)) ||
                    (p.getCategoryName() != null && p.getCategoryName().toLowerCase().contains(q));
            })
            .filter(p -> {
                if (category == null || category.isBlank()) return true;
                return (p.getCategoryName() != null && p.getCategoryName().equalsIgnoreCase(category)) ||
                       (p.getCategoryId() != null && p.getCategoryId().equalsIgnoreCase(category));
            })
            .filter(p -> minPrice == null || p.getPriceInr().compareTo(minPrice) >= 0)
            .filter(p -> maxPrice == null || p.getPriceInr().compareTo(maxPrice) <= 0)
            .toList();

        int start = Math.min(page * size, all.size());
        int end = Math.min(start + size, all.size());
        List<ProductResponse> pageItems = all.subList(start, end).stream().map(this::toResponse).toList();

        return PageResponse.of(pageItems, page, size, all.size());
    }

    public ProductResponse getProductByIdOrSlug(String idOrSlug) {
        String cacheKey = "product:" + idOrSlug;
        Optional<ProductResponse> cached = cacheService.get(cacheKey, ProductResponse.class);
        if (cached.isPresent()) {
            return cached.get();
        }

        Product product;
        if (idOrSlug.startsWith("prod_")) {
            product = productRepository.findById(idOrSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + idOrSlug));
        } else {
            product = productRepository.findBySlug(idOrSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + idOrSlug));
        }

        ProductResponse response = toResponse(product);
        cacheService.set(cacheKey, response, PRODUCT_CACHE_TTL);
        cacheService.set("product:" + product.getId(), response, PRODUCT_CACHE_TTL);
        cacheService.set("product:" + product.getSlug(), response, PRODUCT_CACHE_TTL);
        return response;
    }

    public List<ProductResponse> getStoreProducts(String storeId) {
        return productRepository.findByStoreId(storeId).stream()
            .map(this::toResponse)
            .toList();
    }

    public ProductResponse createProduct(String storeId, String userId, ProductCreateRequest request) {
        verifyStoreOwnership(storeId, userId);

        String slug = request.slug() != null && !request.slug().isBlank()
            ? request.slug().toLowerCase().replace(" ", "-")
            : request.name().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis() % 1000;

        Product product = new Product(
            "prod_" + System.currentTimeMillis(),
            storeId,
            request.categoryId(),
            request.name(),
            slug,
            request.priceInr(),
            request.stockQuantity()
        );
        product.setCategoryName(request.categoryName() != null ? request.categoryName() : "Handmade & Crafts");
        product.setBlurb(request.blurb());
        product.setDescription(request.description() != null ? request.description() : request.blurb());
        product.setMrpInr(request.mrpInr());
        product.setSku(request.sku());
        product.setStatus(request.status() != null ? request.status() : ProductStatus.PUBLISHED);
        product.setImageUrl(request.imageUrl() != null ? request.imageUrl() : "/placeholder.png");
        product.setTags(request.tags());
        product.setShippingInfo(request.shippingInfo());
        product.setCareInstructions(request.careInstructions());

        productRepository.save(product);

        // Invalidate catalog search caches
        cacheService.deleteByPrefix("catalog:search");

        return toResponse(product);
    }

    public ProductResponse updateProduct(String storeId, String productId, String userId, ProductUpdateRequest request) {
        verifyStoreOwnership(storeId, userId);

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!product.getStoreId().equals(storeId)) {
            throw new ForbiddenException("Product does not belong to the specified store.");
        }

        if (request.name() != null) product.setName(request.name());
        if (request.categoryId() != null) product.setCategoryId(request.categoryId());
        if (request.categoryName() != null) product.setCategoryName(request.categoryName());
        if (request.blurb() != null) product.setBlurb(request.blurb());
        if (request.description() != null) product.setDescription(request.description());
        if (request.priceInr() != null) product.setPriceInr(request.priceInr());
        if (request.mrpInr() != null) product.setMrpInr(request.mrpInr());
        if (request.stockQuantity() != null) product.setStockQuantity(request.stockQuantity());
        if (request.sku() != null) product.setSku(request.sku());
        if (request.status() != null) product.setStatus(request.status());
        if (request.imageUrl() != null) product.setImageUrl(request.imageUrl());
        if (request.tags() != null) product.setTags(request.tags());
        if (request.shippingInfo() != null) product.setShippingInfo(request.shippingInfo());
        if (request.careInstructions() != null) product.setCareInstructions(request.careInstructions());
        product.setUpdatedAt(Instant.now());

        productRepository.save(product);

        // Explicit cache invalidation
        cacheService.delete("product:" + product.getId());
        cacheService.delete("product:" + product.getSlug());
        cacheService.deleteByPrefix("catalog:search");

        return toResponse(product);
    }

    public void deleteProduct(String storeId, String productId, String userId) {
        verifyStoreOwnership(storeId, userId);

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!product.getStoreId().equals(storeId)) {
            throw new ForbiddenException("Product does not belong to the specified store.");
        }

        productRepository.deleteById(productId);

        // Invalidate caches
        cacheService.delete("product:" + product.getId());
        cacheService.delete("product:" + product.getSlug());
        cacheService.deleteByPrefix("catalog:search");
    }

    private void verifyStoreOwnership(String storeId, String userId) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        if (!organizationRepository.isUserMember(store.getOrganizationId(), userId)) {
            throw new ForbiddenException("You are not authorized to manage products for this store.");
        }
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getStoreId(),
            product.getCategoryId(),
            product.getCategoryName(),
            product.getName(),
            product.getSlug(),
            product.getBlurb(),
            product.getDescription(),
            product.getPriceInr(),
            product.getMrpInr(),
            product.getStockQuantity(),
            product.getSku(),
            product.getStatus(),
            product.getImageUrl(),
            product.getTags(),
            product.getShippingInfo(),
            product.getCareInstructions(),
            product.getRatingValue(),
            product.getReviewCount(),
            product.getCreatedAt()
        );
    }
}
