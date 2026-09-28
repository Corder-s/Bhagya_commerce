package com.bhagya.commerce.billing.service;

import com.bhagya.commerce.billing.domain.BillingInvoice;
import com.bhagya.commerce.billing.domain.BillingProfile;
import com.bhagya.commerce.billing.domain.MerchantPlan;
import com.bhagya.commerce.billing.domain.MerchantSubscription;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class BillingService {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    private static final List<MerchantPlan> PLANS = Arrays.asList(
            new MerchantPlan(
                    "plan_starter",
                    "Starter Artisan",
                    "For emerging craftspeople taking their first steps online.",
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    4.5,
                    25,
                    false,
                    "NONE",
                    2,
                    Arrays.asList("Up to 25 products", "Standard storefront", "4.5% transaction commission", "Community support")
            ),
            new MerchantPlan(
                    "plan_growth",
                    "Growth Guild",
                    "For established artisan studios scaling direct craft sales.",
                    new BigDecimal("999.00"),
                    new BigDecimal("9990.00"),
                    2.5,
                    250,
                    true,
                    "STANDARD",
                    10,
                    Arrays.asList("Up to 250 products", "Custom domain support", "2.5% transaction commission", "Bhagya AI Craft Storyteller", "Priority support")
            ),
            new MerchantPlan(
                    "plan_pro",
                    "Master Guild Pro",
                    "For high-volume artisan cooperatives and master weavers.",
                    new BigDecimal("2499.00"),
                    new BigDecimal("24990.00"),
                    1.5,
                    1500,
                    true,
                    "ADVANCED",
                    50,
                    Arrays.asList("Up to 1,500 products", "Custom domain & white-label", "1.5% transaction commission", "Advanced AI analytics & pricing assistant", "Dedicated account manager")
            ),
            new MerchantPlan(
                    "plan_enterprise",
                    "Artisan Heritage Enterprise",
                    "For state handicraft federations and heritage clusters.",
                    new BigDecimal("5999.00"),
                    new BigDecimal("59990.00"),
                    0.9,
                    10000,
                    true,
                    "UNLIMITED",
                    200,
                    Arrays.asList("Unlimited products", "Multi-cluster store network", "0.9% transaction commission", "Custom AI copilot training", "24/7 SLA telephone support")
            )
    );

    public BillingService(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<MerchantPlan> getAvailablePlans() {
        return PLANS;
    }

    public MerchantPlan getPlanById(String planId) {
        return PLANS.stream()
                .filter(p -> p.getId().equalsIgnoreCase(planId))
                .findFirst()
                .orElse(PLANS.get(1)); // default Growth Guild
    }

    public MerchantSubscription getSubscription(String orgId) {
        try {
            String sql = "SELECT * FROM subscriptions WHERE organization_id = :orgId LIMIT 1";
            List<MerchantSubscription> list = jdbcTemplate.query(sql, new MapSqlParameterSource("orgId", orgId), (rs, i) -> {
                MerchantSubscription sub = new MerchantSubscription();
                sub.setId(rs.getString("id"));
                sub.setOrganizationId(rs.getString("organization_id"));
                sub.setPlanId(rs.getString("plan_id"));
                sub.setStatus(rs.getString("status"));
                sub.setCurrentPeriodStart(rs.getTimestamp("starts_at").toInstant());
                sub.setCurrentPeriodEnd(rs.getTimestamp("renews_at").toInstant());
                MerchantPlan plan = getPlanById(sub.getPlanId());
                sub.setPlanName(plan.getName());
                sub.setBillingInterval("MONTHLY");
                sub.setProvider("MOCK_RAZORPAY");
                return sub;
            });

            if (!list.isEmpty()) {
                return list.get(0);
            }
        } catch (Exception ignored) {}

        // Mock fallback active subscription
        MerchantSubscription sub = new MerchantSubscription();
        sub.setId("sub_org_active_01");
        sub.setOrganizationId(orgId != null ? orgId : "org_dev_merchant");
        sub.setPlanId("plan_growth");
        sub.setPlanName("Growth Guild");
        sub.setStatus("ACTIVE");
        sub.setBillingInterval("MONTHLY");
        sub.setProvider("MOCK_RAZORPAY");
        sub.setProviderSubscriptionId("sub_rzp_884910294");
        sub.setCurrentPeriodStart(Instant.now().minus(14, ChronoUnit.DAYS));
        sub.setCurrentPeriodEnd(Instant.now().plus(16, ChronoUnit.DAYS));
        sub.setCancelAtPeriodEnd(false);
        sub.setCreatedAt(Instant.now().minus(14, ChronoUnit.DAYS));
        sub.setUpdatedAt(Instant.now());
        return sub;
    }

    @Transactional
    public MerchantSubscription changePlan(String orgId, String newPlanId) {
        MerchantPlan plan = getPlanById(newPlanId);
        MerchantSubscription sub = getSubscription(orgId);
        sub.setPlanId(plan.getId());
        sub.setPlanName(plan.getName());
        sub.setStatus("ACTIVE");
        sub.setCancelAtPeriodEnd(false);
        sub.setUpdatedAt(Instant.now());

        // Update database
        try {
            String sql = "UPDATE subscriptions SET plan_id = :planId, status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP WHERE organization_id = :orgId";
            jdbcTemplate.update(sql, new MapSqlParameterSource("planId", plan.getId()).addValue("orgId", orgId));
        } catch (Exception ignored) {}

        // Generate billing invoice for new period
        if (plan.getMonthlyPriceInr().compareTo(BigDecimal.ZERO) > 0) {
            issueBillingInvoice(orgId, sub.getId(), plan);
        }

        return sub;
    }

    @Transactional
    public MerchantSubscription cancelSubscription(String orgId) {
        MerchantSubscription sub = getSubscription(orgId);
        sub.setCancelAtPeriodEnd(true);
        sub.setUpdatedAt(Instant.now());
        return sub;
    }

    @Transactional
    public MerchantSubscription resumeSubscription(String orgId) {
        MerchantSubscription sub = getSubscription(orgId);
        sub.setCancelAtPeriodEnd(false);
        sub.setStatus("ACTIVE");
        sub.setUpdatedAt(Instant.now());
        return sub;
    }

    public BillingProfile getBillingProfile(String orgId) {
        try {
            String sql = "SELECT * FROM billing_profiles WHERE organization_id = :orgId LIMIT 1";
            List<BillingProfile> list = jdbcTemplate.query(sql, new MapSqlParameterSource("orgId", orgId), (rs, i) -> {
                BillingProfile p = new BillingProfile();
                p.setOrganizationId(rs.getString("organization_id"));
                p.setLegalBusinessName(rs.getString("legal_business_name"));
                p.setGstin(rs.getString("gstin"));
                p.setBillingEmail(rs.getString("billing_email"));
                p.setBillingPhone(rs.getString("billing_phone"));
                p.setAddressLine1(rs.getString("address_line1"));
                p.setAddressLine2(rs.getString("address_line2"));
                p.setCity(rs.getString("city"));
                p.setState(rs.getString("state"));
                p.setPostalCode(rs.getString("postal_code"));
                p.setCountry(rs.getString("country"));
                return p;
            });
            if (!list.isEmpty()) {
                return list.get(0);
            }
        } catch (Exception ignored) {}

        BillingProfile profile = new BillingProfile();
        profile.setOrganizationId(orgId != null ? orgId : "org_dev_merchant");
        profile.setLegalBusinessName("Tula Organics & Handlooms Pvt Ltd");
        profile.setGstin("33AABCT9981F1Z8");
        profile.setBillingEmail("billing@tulaorganics.in");
        profile.setBillingPhone("+91 98401 23456");
        profile.setAddressLine1("42, Weaver Colony, Gandhi Nagar");
        profile.setAddressLine2("Near Heritage Handloom Center");
        profile.setCity("Coimbatore");
        profile.setState("Tamil Nadu");
        profile.setPostalCode("641001");
        profile.setCountry("India");
        return profile;
    }

    @Transactional
    public BillingProfile updateBillingProfile(BillingProfile profile) {
        try {
            String sql = "INSERT INTO billing_profiles (organization_id, legal_business_name, gstin, billing_email, billing_phone, address_line1, address_line2, city, state, postal_code, country, updated_at) " +
                    "VALUES (:orgId, :name, :gstin, :email, :phone, :line1, :line2, :city, :state, :pincode, :country, CURRENT_TIMESTAMP) " +
                    "ON CONFLICT (organization_id) DO UPDATE SET " +
                    "legal_business_name = EXCLUDED.legal_business_name, gstin = EXCLUDED.gstin, billing_email = EXCLUDED.billing_email, billing_phone = EXCLUDED.billing_phone, address_line1 = EXCLUDED.address_line1, address_line2 = EXCLUDED.address_line2, city = EXCLUDED.city, state = EXCLUDED.state, postal_code = EXCLUDED.postal_code, updated_at = CURRENT_TIMESTAMP";

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("orgId", profile.getOrganizationId())
                    .addValue("name", profile.getLegalBusinessName())
                    .addValue("gstin", profile.getGstin())
                    .addValue("email", profile.getBillingEmail())
                    .addValue("phone", profile.getBillingPhone())
                    .addValue("line1", profile.getAddressLine1())
                    .addValue("line2", profile.getAddressLine2())
                    .addValue("city", profile.getCity())
                    .addValue("state", profile.getState())
                    .addValue("pincode", profile.getPostalCode())
                    .addValue("country", profile.getCountry() != null ? profile.getCountry() : "India");

            jdbcTemplate.update(sql, params);
        } catch (Exception ignored) {}

        return profile;
    }

    public List<BillingInvoice> getBillingInvoices(String orgId) {
        try {
            String sql = "SELECT * FROM billing_invoices WHERE organization_id = :orgId ORDER BY issued_at DESC";
            List<BillingInvoice> list = jdbcTemplate.query(sql, new MapSqlParameterSource("orgId", orgId), (rs, i) -> {
                BillingInvoice inv = new BillingInvoice();
                inv.setId(rs.getString("id"));
                inv.setInvoiceNumber(rs.getString("invoice_number"));
                inv.setOrganizationId(rs.getString("organization_id"));
                inv.setSubscriptionId(rs.getString("subscription_id"));
                inv.setPlanId(rs.getString("plan_id"));
                inv.setPlanName(rs.getString("plan_name"));
                inv.setPeriodStart(rs.getTimestamp("period_start").toInstant());
                inv.setPeriodEnd(rs.getTimestamp("period_end").toInstant());
                inv.setSubtotal(rs.getBigDecimal("subtotal"));
                inv.setTax(rs.getBigDecimal("tax"));
                inv.setTotal(rs.getBigDecimal("total"));
                inv.setCurrency(rs.getString("currency"));
                inv.setStatus(rs.getString("status"));
                inv.setPaymentMethod(rs.getString("payment_method"));
                inv.setIssuedAt(rs.getTimestamp("issued_at").toInstant());
                return inv;
            });
            if (!list.isEmpty()) {
                return list;
            }
        } catch (Exception ignored) {}

        // Mock historical SaaS invoices
        List<BillingInvoice> invoices = new ArrayList<>();

        BillingInvoice inv1 = new BillingInvoice();
        inv1.setId("bi_2026_09");
        inv1.setInvoiceNumber("SUB-2026-98124");
        inv1.setOrganizationId(orgId != null ? orgId : "org_dev_merchant");
        inv1.setSubscriptionId("sub_org_active_01");
        inv1.setPlanId("plan_growth");
        inv1.setPlanName("Growth Guild");
        inv1.setPeriodStart(Instant.now().minus(14, ChronoUnit.DAYS));
        inv1.setPeriodEnd(Instant.now().plus(16, ChronoUnit.DAYS));
        inv1.setSubtotal(new BigDecimal("999.00"));
        inv1.setTax(new BigDecimal("179.82")); // 18% SaaS GST
        inv1.setTotal(new BigDecimal("1178.82"));
        inv1.setCurrency("INR");
        inv1.setStatus("PAID");
        inv1.setPaymentMethod("HDFC Business Card ending in 4092");
        inv1.setPaidAt(Instant.now().minus(14, ChronoUnit.DAYS));
        inv1.setIssuedAt(Instant.now().minus(14, ChronoUnit.DAYS));
        invoices.add(inv1);

        BillingInvoice inv2 = new BillingInvoice();
        inv2.setId("bi_2026_08");
        inv2.setInvoiceNumber("SUB-2026-87102");
        inv2.setOrganizationId(orgId != null ? orgId : "org_dev_merchant");
        inv2.setSubscriptionId("sub_org_active_01");
        inv2.setPlanId("plan_growth");
        inv2.setPlanName("Growth Guild");
        inv2.setPeriodStart(Instant.now().minus(44, ChronoUnit.DAYS));
        inv2.setPeriodEnd(Instant.now().minus(14, ChronoUnit.DAYS));
        inv2.setSubtotal(new BigDecimal("999.00"));
        inv2.setTax(new BigDecimal("179.82"));
        inv2.setTotal(new BigDecimal("1178.82"));
        inv2.setCurrency("INR");
        inv2.setStatus("PAID");
        inv2.setPaymentMethod("HDFC Business Card ending in 4092");
        inv2.setPaidAt(Instant.now().minus(44, ChronoUnit.DAYS));
        inv2.setIssuedAt(Instant.now().minus(44, ChronoUnit.DAYS));
        invoices.add(inv2);

        return invoices;
    }

    private void issueBillingInvoice(String orgId, String subscriptionId, MerchantPlan plan) {
        String id = "bi_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String number = "SUB-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        BigDecimal subtotal = plan.getMonthlyPriceInr();
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18")).setScale(2, BigDecimal.ROUND_HALF_UP);
        BigDecimal total = subtotal.add(tax);

        try {
            String sql = "INSERT INTO billing_invoices (id, invoice_number, organization_id, subscription_id, plan_id, plan_name, period_start, period_end, subtotal, tax, total, currency, status, payment_method, paid_at, issued_at) " +
                    "VALUES (:id, :num, :orgId, :subId, :planId, :planName, :pStart, :pEnd, :subtotal, :tax, :total, 'INR', 'PAID', 'UPI Autopay / Card', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("id", id)
                    .addValue("num", number)
                    .addValue("orgId", orgId)
                    .addValue("subId", subscriptionId)
                    .addValue("planId", plan.getId())
                    .addValue("planName", plan.getName())
                    .addValue("pStart", Instant.now())
                    .addValue("pEnd", Instant.now().plus(30, ChronoUnit.DAYS))
                    .addValue("subtotal", subtotal)
                    .addValue("tax", tax)
                    .addValue("total", total);
            jdbcTemplate.update(sql, params);
        } catch (Exception ignored) {}
    }

    public boolean processWebhookWithIdempotency(String eventId, String provider, String eventType) {
        try {
            String sql = "INSERT INTO processed_webhook_events (event_id, provider, event_type, processed_at) VALUES (:eId, :provider, :type, CURRENT_TIMESTAMP)";
            jdbcTemplate.update(sql, new MapSqlParameterSource("eId", eventId).addValue("provider", provider).addValue("type", eventType));
            return true;
        } catch (Exception ex) {
            // Already processed (idempotent skip)
            return false;
        }
    }
}
