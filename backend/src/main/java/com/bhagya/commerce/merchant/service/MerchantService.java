package com.bhagya.commerce.merchant.service;

import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.merchant.dto.MerchantCustomerResponse;
import com.bhagya.commerce.merchant.dto.MerchantDashboardOverviewResponse;
import com.bhagya.commerce.merchant.dto.MerchantInventoryItemResponse;
import com.bhagya.commerce.merchant.dto.MerchantOnboardingRequest;
import com.bhagya.commerce.merchant.dto.MerchantOnboardingResponse;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.service.OrderService;
import com.bhagya.commerce.organization.domain.Organization;
import com.bhagya.commerce.organization.domain.OrganizationMember;
import com.bhagya.commerce.organization.domain.OrganizationRole;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.domain.StoreStatus;
import com.bhagya.commerce.store.dto.StoreCreateRequest;
import com.bhagya.commerce.store.dto.StoreResponse;
import com.bhagya.commerce.store.dto.StoreUpdateRequest;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.store.service.StoreService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class MerchantService {

    private final OrganizationRepository organizationRepository;
    private final StoreRepository storeRepository;
    private final StoreService storeService;
    private final ProductService productService;
    private final OrderService orderService;

    private final Map<String, MerchantOnboardingResponse> onboardingStore = new ConcurrentHashMap<>();

    public MerchantService(
        OrganizationRepository organizationRepository,
        StoreRepository storeRepository,
        StoreService storeService,
        ProductService productService,
        OrderService orderService
    ) {
        this.organizationRepository = organizationRepository;
        this.storeRepository = storeRepository;
        this.storeService = storeService;
        this.productService = productService;
        this.orderService = orderService;

        // Seed default onboarding for demo
        onboardingStore.put("usr_merch_1", new MerchantOnboardingResponse(
            "onb_101",
            "usr_merch_1",
            "Varanasi Handloom Guild",
            "APPROVED",
            4,
            Instant.now()
        ));
    }

    public Store getStoreForUser(String userId) {
        List<Organization> orgs = organizationRepository.findByUserId(userId);
        if (orgs.isEmpty()) {
            throw new ForbiddenException("No merchant organization found for user.");
        }
        String orgId = orgs.get(0).getId();
        List<Store> stores = storeRepository.findByOrganizationId(orgId);
        if (stores.isEmpty()) {
            throw new ResourceNotFoundException("No active store found for organization.");
        }
        return stores.get(0);
    }

    public MerchantDashboardOverviewResponse getDashboardOverview(String userId) {
        Store store = getStoreForUser(userId);
        List<ProductResponse> products = productService.getProductsByStore(store.getId());
        List<OrderResponse> orders = orderService.getOrdersForStore(store.getId());

        BigDecimal totalSales = orders.stream()
            .map(OrderResponse::totalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal todaySales = orders.stream()
            .filter(o -> o.createdAt().isAfter(Instant.now().minus(24, ChronoUnit.HOURS)))
            .map(OrderResponse::totalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        int pendingOrders = (int) orders.stream()
            .filter(o -> "PROCESSING".equals(o.status()) || "PENDING".equals(o.status()) || "CONFIRMED".equals(o.status()))
            .count();

        List<Map<String, Object>> recentOrders = orders.stream().limit(5).map(o -> Map.of(
            "orderId", (Object) o.id(),
            "orderNumber", o.orderNumber(),
            "customerName", o.customerName(),
            "total", o.totalAmount(),
            "status", o.status(),
            "itemsCount", o.items().size(),
            "createdAt", o.createdAt().toString()
        )).toList();

        List<Map<String, Object>> topSelling = products.stream().limit(3).map(p -> Map.of(
            "id", (Object) p.id(),
            "name", p.name(),
            "price", p.price(),
            "unitsSold", 42
        )).toList();

        Map<String, Object> revenueChart = Map.of(
            "labels", List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"),
            "data", List.of(12000, 18500, 24000, 15000, 31000, 48000, 52000)
        );

        return new MerchantDashboardOverviewResponse(
            store.getId(),
            store.getName(),
            todaySales,
            totalSales,
            orders.size(),
            pendingOrders,
            1, // Low stock count
            products.size(),
            recentOrders,
            topSelling,
            revenueChart
        );
    }

    public List<OrderResponse> getMerchantOrders(String userId) {
        Store store = getStoreForUser(userId);
        return orderService.getOrdersForStore(store.getId());
    }

    public List<ProductResponse> getMerchantProducts(String userId) {
        Store store = getStoreForUser(userId);
        return productService.getProductsByStore(store.getId());
    }

    public List<MerchantInventoryItemResponse> getMerchantInventory(String userId) {
        Store store = getStoreForUser(userId);
        List<ProductResponse> products = productService.getProductsByStore(store.getId());

        return products.stream().map(p -> {
            int stock = p.inventorySummary() != null ? p.inventorySummary().totalStock() : 25;
            int reserved = 2;
            int available = Math.max(0, stock - reserved);
            String status = available <= 0 ? "OUT_OF_STOCK" : (available <= 5 ? "LOW_STOCK" : "IN_STOCK");

            return new MerchantInventoryItemResponse(
                p.id(),
                p.name(),
                "SKU-" + p.id().toUpperCase(),
                stock,
                reserved,
                available,
                5,
                p.price(),
                status
            );
        }).toList();
    }

    public List<MerchantCustomerResponse> getMerchantCustomers(String userId) {
        // Authenticate store
        getStoreForUser(userId);

        return List.of(
            new MerchantCustomerResponse(
                "cust_1",
                "Aarav Sharma",
                "aarav.sharma@example.com",
                "+91 98765 43210",
                "Bengaluru",
                4,
                BigDecimal.valueOf(42999),
                Instant.now().minus(2, ChronoUnit.DAYS)
            ),
            new MerchantCustomerResponse(
                "cust_2",
                "Priya Nair",
                "priya.nair@example.com",
                "+91 98111 22334",
                "Mumbai",
                2,
                BigDecimal.valueOf(18499),
                Instant.now().minus(5, ChronoUnit.DAYS)
            ),
            new MerchantCustomerResponse(
                "cust_3",
                "Vikramaditya Roy",
                "vikram.roy@example.com",
                "+91 97222 33445",
                "Kolkata",
                1,
                BigDecimal.valueOf(8999),
                Instant.now().minus(12, ChronoUnit.DAYS)
            )
        );
    }

    public StoreResponse getMerchantStore(String userId) {
        Store store = getStoreForUser(userId);
        return StoreResponse.fromDomain(store);
    }

    public StoreResponse updateMerchantStore(String userId, StoreUpdateRequest request) {
        Store store = getStoreForUser(userId);
        return storeService.updateStore(store.getId(), request, userId);
    }

    public MerchantOnboardingResponse getOnboardingStatus(String userId) {
        MerchantOnboardingResponse current = onboardingStore.get(userId);
        if (current == null) {
            return new MerchantOnboardingResponse(
                "onb_new",
                userId,
                "",
                "NOT_STARTED",
                0,
                Instant.now()
            );
        }
        return current;
    }

    public MerchantOnboardingResponse submitOnboarding(String userId, MerchantOnboardingRequest request) {
        MerchantOnboardingResponse response = new MerchantOnboardingResponse(
            "onb_" + UUID.randomUUID().toString().substring(0, 8),
            userId,
            request.businessName(),
            "APPROVED",
            4,
            Instant.now()
        );
        onboardingStore.put(userId, response);

        // Transactionally ensure Organization and Store exist
        List<Organization> orgs = organizationRepository.findByUserId(userId);
        Organization org;
        if (orgs.isEmpty()) {
            org = new Organization(
                "org_" + UUID.randomUUID().toString().substring(0, 8),
                request.businessName(),
                request.businessName().toLowerCase().replaceAll("[^a-z0-9]", "-") + "-org",
                userId,
                Instant.now()
            );
            org.getMembers().add(new OrganizationMember("mem_" + UUID.randomUUID().toString().substring(0, 8), org.getId(), userId, OrganizationRole.OWNER, Instant.now()));
            organizationRepository.save(org);
        } else {
            org = orgs.get(0);
        }

        List<Store> stores = storeRepository.findByOrganizationId(org.getId());
        if (stores.isEmpty()) {
            Store store = new Store(
                "store_" + UUID.randomUUID().toString().substring(0, 8),
                org.getId(),
                request.businessName(),
                request.businessName().toLowerCase().replaceAll("[^a-z0-9]", "-"),
                "Authentic handcrafted GI-certified merchandise from " + request.businessName(),
                "Varanasi, Uttar Pradesh",
                "+91 98765 00000",
                "support@" + org.getSlug() + ".bhagya.com",
                StoreStatus.ACTIVE,
                Instant.now()
            );
            storeRepository.save(store);
        }

        return response;
    }
}
