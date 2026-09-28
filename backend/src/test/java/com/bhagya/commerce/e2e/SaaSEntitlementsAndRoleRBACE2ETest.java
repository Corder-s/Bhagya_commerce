package com.bhagya.commerce.e2e;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.billing.domain.MerchantPlan;
import com.bhagya.commerce.billing.service.BillingService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.team.domain.RoleCode;
import com.bhagya.commerce.team.domain.StoreAccessType;
import com.bhagya.commerce.team.dto.TeamInviteRequest;
import com.bhagya.commerce.team.dto.TeamInvitationDto;
import com.bhagya.commerce.team.service.TeamService;
import com.bhagya.commerce.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class SaaSEntitlementsAndRoleRBACE2ETest {

    private BillingService billingService;
    private TeamService teamService;
    private final String orgId = "org_varanasi_heritage";
    private final String ownerId = "usr_dev_merchant_01";
    private final String supportAgentId = "usr_dev_merchant_04";

    @BeforeEach
    void setUp() {
        billingService = new BillingService(null);
        OrganizationRepository organizationRepository = new OrganizationRepository();
        StoreRepository storeRepository = new StoreRepository();
        UserRepository userRepository = new UserRepository();
        AuditService auditService = new AuditService();
        teamService = new TeamService(organizationRepository, userRepository, storeRepository, null, auditService, null);
    }

    @Test
    @DisplayName("SaaS Entitlements: Validate tiered limits across Starter, Growth, Pro, and Enterprise")
    void testMerchantPlanTiersAndEntitlements() {
        List<MerchantPlan> plans = billingService.getAvailablePlans();
        assertNotNull(plans);
        assertEquals(4, plans.size());

        MerchantPlan starter = billingService.getPlanById("plan_starter");
        assertEquals("Starter Artisan", starter.getName());
        assertEquals(BigDecimal.ZERO, starter.getMonthlyPriceInr());
        assertEquals(25, starter.getMaxProducts());
        assertEquals(2, starter.getStorageLimitGb());
        assertFalse(starter.isCustomDomainEnabled());
        assertEquals("NONE", starter.getAiTier());

        MerchantPlan growth = billingService.getPlanById("plan_growth");
        assertEquals("Growth Guild", growth.getName());
        assertEquals(new BigDecimal("999.00"), growth.getMonthlyPriceInr());
        assertEquals(250, growth.getMaxProducts());
        assertEquals(10, growth.getStorageLimitGb());
        assertTrue(growth.isCustomDomainEnabled());
        assertEquals("STANDARD", growth.getAiTier());

        MerchantPlan pro = billingService.getPlanById("plan_pro");
        assertEquals("Master Guild Pro", pro.getName());
        assertEquals(1500, pro.getMaxProducts());
        assertEquals(50, pro.getStorageLimitGb());
        assertTrue(pro.isCustomDomainEnabled());
        assertEquals("ADVANCED", pro.getAiTier());

        MerchantPlan enterprise = billingService.getPlanById("plan_enterprise");
        assertEquals(10000, enterprise.getMaxProducts());
        assertEquals(200, enterprise.getStorageLimitGb());
        assertTrue(enterprise.isCustomDomainEnabled());
        assertEquals("UNLIMITED", enterprise.getAiTier());
    }

    @Test
    @DisplayName("RBAC: Owner can invite new team members with specific roles")
    void testOwnerCanInviteTeamMembers() {
        TeamInviteRequest req = new TeamInviteRequest(
            "new.weaver@varanasiheritage.in",
            RoleCode.SUPPORT_AGENT,
            StoreAccessType.ALL_STORES,
            null
        );

        TeamInvitationDto invitation = teamService.inviteMember(orgId, ownerId, req);
        assertNotNull(invitation);
        assertEquals("new.weaver@varanasiheritage.in", invitation.email());
        assertEquals(RoleCode.SUPPORT_AGENT, invitation.role());
    }

    @Test
    @DisplayName("RBAC: Non-owner cannot grant or invite Organization Owner role")
    void testNonOwnerCannotInviteMembers() {
        TeamInviteRequest req = new TeamInviteRequest(
            "unauthorized@guild.in",
            RoleCode.OWNER,
            StoreAccessType.ALL_STORES,
            null
        );

        assertThrows(ForbiddenException.class, () -> {
            teamService.inviteMember(orgId, supportAgentId, req);
        });
    }

    @Test
    @DisplayName("RBAC: Cannot remove organization owner")
    void testCannotRemoveOrganizationOwner() {
        assertThrows(ValidationException.class, () -> {
            teamService.removeMember(orgId, ownerId, "mem_01");
        });
    }
}
