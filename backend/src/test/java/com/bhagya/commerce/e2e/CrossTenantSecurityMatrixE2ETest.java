package com.bhagya.commerce.e2e;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.loyalty.domain.LoyaltyAccount;
import com.bhagya.commerce.loyalty.repository.LoyaltyAccountRepository;
import com.bhagya.commerce.loyalty.repository.LoyaltyLedgerRepository;
import com.bhagya.commerce.loyalty.repository.LoyaltyRewardRepository;
import com.bhagya.commerce.loyalty.repository.CustomerReferralRepository;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import com.bhagya.commerce.marketing.domain.Campaign;
import com.bhagya.commerce.marketing.repository.CampaignRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.order.service.OrderService;
import com.bhagya.commerce.organization.domain.Organization;
import com.bhagya.commerce.organization.domain.OrganizationMember;
import com.bhagya.commerce.organization.domain.OrganizationRole;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.shipping.domain.Shipment;
import com.bhagya.commerce.shipping.domain.ShipmentStatus;
import com.bhagya.commerce.shipping.repository.ShipmentRepository;
import com.bhagya.commerce.shipping.service.ShippingService;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.user.domain.Address;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.domain.UserRole;
import com.bhagya.commerce.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class CrossTenantSecurityMatrixE2ETest {

    private OrganizationRepository organizationRepository;
    private StoreRepository storeRepository;
    private UserRepository userRepository;
    private ProductRepository productRepository;
    private OrderRepository orderRepository;
    private ShipmentRepository shipmentRepository;
    private CampaignRepository campaignRepository;
    private LoyaltyAccountRepository loyaltyAccountRepository;

    private TenantSecurityService tenantSecurityService;
    private OrderService orderService;
    private ShippingService shippingService;

    // Tenant A Entities
    private Organization orgA;
    private Store storeA;
    private User merchantOwnerA;
    private User customerA;
    private UserPrincipal principalA;
    private Order orderA;

    // Tenant B Entities
    private Organization orgB;
    private Store storeB;
    private User merchantOwnerB;
    private User customerB;
    private UserPrincipal principalB;
    private Order orderB;

    private Address createAddress(String street, String city, String state, String pincode, String phone) {
        Address addr = new Address();
        addr.setId("addr_" + System.currentTimeMillis());
        addr.setName("Customer");
        addr.setPhone(phone);
        addr.setAddressLine1(street);
        addr.setCity(city);
        addr.setState(state);
        addr.setPincode(pincode);
        return addr;
    }

    @BeforeEach
    void setUp() {
        organizationRepository = new OrganizationRepository();
        storeRepository = new StoreRepository();
        userRepository = new UserRepository();
        productRepository = new ProductRepository();
        orderRepository = new OrderRepository();
        shipmentRepository = new ShipmentRepository();
        campaignRepository = new CampaignRepository();
        loyaltyAccountRepository = new LoyaltyAccountRepository();

        AuditService auditService = new AuditService();
        tenantSecurityService = new TenantSecurityService(organizationRepository, storeRepository, auditService);
        orderService = new OrderService(orderRepository, productRepository, storeRepository, userRepository, null);
        shippingService = new ShippingService(orderRepository, shipmentRepository, null, null, auditService, "test_secret");

        // Provision Tenant A (Jaipur Artisan Gems)
        orgA = new Organization("org_jaipur", "Jaipur Heritage Jewels", "Jaipur Heritage Jewels Pvt Ltd", "AAAPL1234F", "08AAAPL1234F1Z5");
        organizationRepository.save(orgA);

        storeA = new Store("store_jaipur_gems", orgA.getId(), "Jaipur Gems Flagship", "jaipur-gems", "support@jaipurgems.in");
        storeRepository.save(storeA);

        merchantOwnerA = new User("usr_owner_jaipur", "owner@jaipurgems.in", "Jaipur Owner", "pw_hash", UserRole.STORE_OWNER);
        userRepository.save(merchantOwnerA);

        OrganizationMember memberA = new OrganizationMember("mem_a", orgA.getId(), merchantOwnerA.getId(), OrganizationRole.STORE_OWNER);
        organizationRepository.saveMember(memberA);

        principalA = new UserPrincipal(
            merchantOwnerA.getId(),
            "+919829012345",
            merchantOwnerA.getEmail(),
            merchantOwnerA.getName(),
            storeA.getId(),
            orgA.getId(),
            "STORE_OWNER"
        );

        customerA = new User("usr_customer_a", "customer.a@gmail.com", "Customer A", "pw_hash", UserRole.CUSTOMER);
        userRepository.save(customerA);

        orderA = new Order();
        orderA.setId("ord_tenant_a_1001");
        orderA.setOrderNumber("BG-JAIPUR-001");
        orderA.setUserId(customerA.getId());
        orderA.setStoreId(storeA.getId());
        orderA.setStoreName(storeA.getName());
        orderA.setStatus(OrderStatus.CONFIRMED);
        orderA.setPaymentStatus("PAID");
        orderA.setTotalInr(new BigDecimal("12500.00"));
        orderA.setShippingAddress(createAddress("12 Johari Bazar", "Jaipur", "Rajasthan", "302003", "9829012345"));
        orderRepository.save(orderA);

        // Provision Tenant B (Varanasi Handlooms)
        orgB = new Organization("org_varanasi", "Varanasi Silk Weaver Guild", "Varanasi Silk Weaver Guild Ltd", "BBAPL5678G", "09BBAPL5678G1Z8");
        organizationRepository.save(orgB);

        storeB = new Store("store_varanasi_silk", orgB.getId(), "Varanasi Silk House", "varanasi-silk", "support@varanasisilk.in");
        storeRepository.save(storeB);

        merchantOwnerB = new User("usr_owner_varanasi", "owner@varanasisilk.in", "Varanasi Owner", "pw_hash", UserRole.STORE_OWNER);
        userRepository.save(merchantOwnerB);

        OrganizationMember memberB = new OrganizationMember("mem_b", orgB.getId(), merchantOwnerB.getId(), OrganizationRole.STORE_OWNER);
        organizationRepository.saveMember(memberB);

        principalB = new UserPrincipal(
            merchantOwnerB.getId(),
            "+919415012345",
            merchantOwnerB.getEmail(),
            merchantOwnerB.getName(),
            storeB.getId(),
            orgB.getId(),
            "STORE_OWNER"
        );

        customerB = new User("usr_customer_b", "customer.b@gmail.com", "Customer B", "pw_hash", UserRole.CUSTOMER);
        userRepository.save(customerB);

        orderB = new Order();
        orderB.setId("ord_tenant_b_2002");
        orderB.setOrderNumber("BG-VARANASI-002");
        orderB.setUserId(customerB.getId());
        orderB.setStoreId(storeB.getId());
        orderB.setStoreName(storeB.getName());
        orderB.setStatus(OrderStatus.CONFIRMED);
        orderB.setPaymentStatus("PAID");
        orderB.setTotalInr(new BigDecimal("8500.00"));
        orderB.setShippingAddress(createAddress("88 Ghat Road", "Varanasi", "Uttar Pradesh", "221001", "9415012345"));
        orderRepository.save(orderB);
    }

    @Test
    @DisplayName("Cross-Tenant: Merchant A attempting Store B must be rejected with ForbiddenException")
    void testMerchantStoreAccessCrossTenant() {
        // Merchant A requesting Store A succeeds
        assertDoesNotThrow(() -> tenantSecurityService.validateUserStoreAccess(principalA, storeA.getId()));

        // Merchant A requesting Store B MUST REJECT
        ForbiddenException ex = assertThrows(ForbiddenException.class, () -> {
            tenantSecurityService.validateUserStoreAccess(principalA, storeB.getId());
        });
        assertTrue(ex.getMessage().contains("Cross-tenant access denied"));
    }

    @Test
    @DisplayName("Cross-Tenant: Merchant A attempting Org B must be rejected")
    void testMerchantOrgAccessCrossTenant() {
        assertEquals(orgA.getId(), tenantSecurityService.resolveAuthoritativeOrgId(principalA, orgA.getId()));

        ForbiddenException ex = assertThrows(ForbiddenException.class, () -> {
            tenantSecurityService.resolveAuthoritativeOrgId(principalA, orgB.getId());
        });
        assertTrue(ex.getMessage().contains("Access denied"));
    }

    @Test
    @DisplayName("Cross-Tenant / IDOR: Customer A cannot view Customer B's order")
    void testCustomerOrderAccessIsolation() {
        // Customer A can view their own order
        assertDoesNotThrow(() -> orderService.getCustomerOrderById(orderA.getId(), customerA.getId()));

        // Customer A trying to view Customer B's order MUST REJECT
        assertThrows(ForbiddenException.class, () -> {
            orderService.getCustomerOrderById(orderB.getId(), customerA.getId());
        });

        // Customer B trying to view Customer A's order MUST REJECT
        assertThrows(ForbiddenException.class, () -> {
            orderService.getCustomerOrderById(orderA.getId(), customerB.getId());
        });
    }

    @Test
    @DisplayName("Cross-Tenant / IDOR: Customer A cannot cancel Customer B's order")
    void testCustomerCancelOrderIsolation() {
        assertThrows(ForbiddenException.class, () -> {
            orderService.cancelOrder(orderB.getId(), customerA.getId(), "Fraudulent cancellation attempt");
        });
        // Verify Order B remains CONFIRMED
        assertEquals(OrderStatus.CONFIRMED, orderRepository.findById(orderB.getId()).get().getStatus());
    }

    @Test
    @DisplayName("Cross-Tenant: Shipping Label access restricted to store owning the order")
    void testShippingLabelStoreIsolation() {
        Shipment shipmentA = new Shipment("ship_a_1", orderA.getId(), "Delhivery Express", "DLH-JAIPUR-01", ShipmentStatus.MANIFESTED, Instant.now());
        shipmentRepository.save(shipmentA);

        // Store A can access shipment label
        assertDoesNotThrow(() -> shippingService.getLabelForShipment(shipmentA.getId(), storeA.getId()));

        // Store B attempting Store A's shipping label MUST REJECT
        assertThrows(ForbiddenException.class, () -> {
            shippingService.getLabelForShipment(shipmentA.getId(), storeB.getId());
        });
    }

    @Test
    @DisplayName("Cross-Tenant Storage: Object key prefix violation outside tenant directory must reject")
    void testStorageObjectKeyTenantScope() {
        // Allowed: within tenant directory
        assertDoesNotThrow(() -> {
            tenantSecurityService.validateObjectKeyTenantScope(storeA.getId(), "stores/" + storeA.getId() + "/products/ruby.jpg");
        });

        // Rejected: attempting to write into Store B's bucket directory
        ForbiddenException ex1 = assertThrows(ForbiddenException.class, () -> {
            tenantSecurityService.validateObjectKeyTenantScope(storeA.getId(), "stores/" + storeB.getId() + "/secret-designs.pdf");
        });
        assertTrue(ex1.getMessage().contains("Cross-tenant storage violation"));

        // Rejected: path traversal attempt
        assertThrows(ForbiddenException.class, () -> {
            tenantSecurityService.validateObjectKeyTenantScope(storeA.getId(), "../root/secret.env");
        });
    }

    @Test
    @DisplayName("Cross-Tenant Customer Ownership: validateCustomerOwnership prevents BOLA/IDOR")
    void testCustomerOwnershipValidation() {
        UserPrincipal customerPrincipal = new UserPrincipal(
            customerA.getId(),
            "+919876543210",
            customerA.getEmail(),
            customerA.getName(),
            null,
            null,
            "CUSTOMER"
        );

        // Can access own profile
        assertDoesNotThrow(() -> tenantSecurityService.validateCustomerOwnership(customerPrincipal, customerA.getId()));

        // Accessing customer B profile MUST REJECT
        assertThrows(ForbiddenException.class, () -> {
            tenantSecurityService.validateCustomerOwnership(customerPrincipal, customerB.getId());
        });
    }

    @Test
    @DisplayName("Cross-Tenant Loyalty Isolation: Customer loyalty accounts partitioned per store")
    void testLoyaltyStoreIsolation() {
        LoyaltyAccount accA = loyaltyAccountRepository.getOrCreate(storeA.getId(), customerA.getId());
        accA.setAvailablePoints(500);
        loyaltyAccountRepository.save(accA);

        // Querying for Store A returns account
        assertTrue(loyaltyAccountRepository.findByStoreAndCustomer(storeA.getId(), customerA.getId()).isPresent());
        assertEquals(500, loyaltyAccountRepository.findByStoreAndCustomer(storeA.getId(), customerA.getId()).get().getAvailablePoints());

        // Querying for Store B does not find this customer's account unless created
        assertTrue(loyaltyAccountRepository.findByStoreAndCustomer(storeB.getId(), customerA.getId()).isEmpty());
    }
}
