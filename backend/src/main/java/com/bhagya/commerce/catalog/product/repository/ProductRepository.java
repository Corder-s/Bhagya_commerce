package com.bhagya.commerce.catalog.product.repository;

import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.domain.ProductStatus;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {

    private final Map<String, Product> productStorage = new ConcurrentHashMap<>();

    public ProductRepository() {
        seed("prod_01", "store_varanasi_silk", "cat_01", "Handloom & Textiles", "Handloom Chanderi Silk Saree", "handloom-cotton-throw-indigo", "Woven with pure zari and mulberry silk", new BigDecimal("3850.00"), new BigDecimal("4500.00"), 12, "BNR-SILK-01", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80", 4.9, 28);
        seed("prod_02", "store_varanasi_silk", "cat_02", "Brassware & Metalcraft", "Moradabad Brass Pooja Diya", "unpolished-millet-grain-blend", "Hand-cast heavy virgin brass with antique lacquer", new BigDecimal("1250.00"), new BigDecimal("1600.00"), 8, "BNR-BRS-02", "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&auto=format&fit=crop&q=80", 4.8, 42);
        seed("prod_03", "store_varanasi_silk", "cat_03", "Ayurveda & Wellness", "Mysore Sandalwood Incense Cones", "ashwagandha-churna", "100% natural, charcoal-free temple grade dhoop", new BigDecimal("450.00"), new BigDecimal("550.00"), 3, "BNR-INC-03", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80", 5.0, 19);
        seed("prod_04", "store_varanasi_silk", "cat_04", "Terracotta & Pottery", "Jaipur Blue Pottery Ceramic Vase", "jaipur-blue-pottery-vase", "Hand-painted quartz stone and glass frit glaze", new BigDecimal("1850.00"), new BigDecimal("2200.00"), 0, "BNR-POT-04", "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80", 4.7, 14);
    }

    private void seed(String id, String storeId, String catId, String catName, String name, String slug, String blurb, BigDecimal price, BigDecimal mrp, int stock, String sku, String img, double rating, int reviews) {
        Product p = new Product(id, storeId, catId, name, slug, price, stock);
        p.setCategoryName(catName);
        p.setBlurb(blurb);
        p.setDescription(blurb + ". Crafted using time-honored artisanal techniques passed down through generations.");
        p.setMrpInr(mrp);
        p.setSku(sku);
        p.setImageUrl(img);
        p.setRatingValue(rating);
        p.setReviewCount(reviews);
        p.setShippingInfo("Dispatched in 24-48 hours. Free delivery on orders over ₹1,499.");
        p.setCareInstructions("Handle with care. Avoid exposure to harsh chemicals or extreme moisture.");
        save(p);
    }

    public List<Product> findAll() {
        return new ArrayList<>(productStorage.values());
    }

    public Optional<Product> findById(String id) {
        return Optional.ofNullable(productStorage.get(id));
    }

    public Optional<Product> findBySlug(String slug) {
        return productStorage.values().stream()
            .filter(p -> p.getSlug().equalsIgnoreCase(slug))
            .findFirst();
    }

    public List<Product> findByStoreId(String storeId) {
        return productStorage.values().stream()
            .filter(p -> p.getStoreId().equals(storeId))
            .toList();
    }

    public Product save(Product product) {
        if (product.getId() == null) {
            product.setId("prod_" + System.currentTimeMillis());
        }
        productStorage.put(product.getId(), product);
        return product;
    }

    public void deleteById(String id) {
        productStorage.remove(id);
    }
}
