package com.bhagya.commerce.team;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.notification.service.NotificationService;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.team.domain.*;
import com.bhagya.commerce.team.dto.*;
import com.bhagya.commerce.team.service.TeamService;
import com.bhagya.commerce.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TeamServiceTest {

    private TeamService teamService;

    @BeforeEach
    void setUp() {
        OrganizationRepository orgRepo = new OrganizationRepository();
        UserRepository userRepo = new UserRepository();
        StoreRepository storeRepo = new StoreRepository();
        NotificationService notifService = Mockito.mock(NotificationService.class);
        AuditService auditService = Mockito.mock(AuditService.class);
        NamedParameterJdbcTemplate jdbcTemplate = Mockito.mock(NamedParameterJdbcTemplate.class);

        teamService = new TeamService(
                orgRepo,
                userRepo,
                storeRepo,
                notifService,
                auditService,
                jdbcTemplate
        );
    }

    @Test
    void testGetRolesAndDefaultMembers() {
        List<RoleDefinitionDto> roles = teamService.getRoles();
        assertFalse(roles.isEmpty());
        assertTrue(roles.stream().anyMatch(r -> r.code() == RoleCode.OWNER));
        assertTrue(roles.stream().anyMatch(r -> r.code() == RoleCode.SUPPORT_AGENT));

        List<TeamMemberDto> members = teamService.getTeamMembers("org_varanasi_heritage");
        assertEquals(3, members.size());
        assertTrue(members.stream().anyMatch(m -> m.role() == RoleCode.OWNER));
    }

    @Test
    void testInviteMemberLifecycle() {
        String orgId = "org_varanasi_heritage";
        TeamInviteRequest req = new TeamInviteRequest(
                "anita.dev@varanasiheritage.in",
                RoleCode.MARKETING_MANAGER,
                StoreAccessType.ALL_STORES,
                List.of()
        );

        TeamInvitationDto invite = teamService.inviteMember(orgId, "usr_dev_merchant_01", req);
        assertNotNull(invite.id());
        assertEquals("anita.dev@varanasiheritage.in", invite.email());
        assertEquals(RoleCode.MARKETING_MANAGER, invite.role());
        assertEquals(InvitationStatus.PENDING, invite.status());

        // Accepting invitation
        AcceptInvitationRequest acceptReq = new AcceptInvitationRequest(
                null,
                "Anita Devi",
                "+91 98401 99887"
        );
        TeamMemberDto accepted = teamService.acceptInvitation(invite.token(), acceptReq);
        assertNotNull(accepted.id());
        assertEquals(RoleCode.MARKETING_MANAGER, accepted.role());
        assertEquals(MemberStatus.ACTIVE, accepted.status());

        // Verifying membership count
        List<TeamMemberDto> updatedMembers = teamService.getTeamMembers(orgId);
        assertEquals(4, updatedMembers.size());
    }

    @Test
    void testInviteExistingActiveMemberThrowsConflict() {
        String orgId = "org_varanasi_heritage";
        TeamInviteRequest req = new TeamInviteRequest(
                "ramnarayan@varanasiheritage.in", // already owner
                RoleCode.ADMIN,
                StoreAccessType.ALL_STORES,
                List.of()
        );

        assertThrows(ConflictException.class, () ->
                teamService.inviteMember(orgId, "usr_dev_merchant_01", req)
        );
    }

    @Test
    void testCriticalInvariantCannotRemoveOrDemoteFinalOwner() {
        String orgId = "org_varanasi_heritage";

        // mem_01 is the sole Owner
        // Attempting to demote mem_01 to MANAGER must fail
        TeamMemberUpdateRequest demoteReq = new TeamMemberUpdateRequest(
                RoleCode.MANAGER,
                StoreAccessType.ALL_STORES,
                List.of(),
                MemberStatus.ACTIVE
        );

        assertThrows(ValidationException.class, () ->
                teamService.updateMember(orgId, "usr_dev_merchant_01", "mem_01", demoteReq)
        );

        // Attempting to remove mem_01 must fail
        assertThrows(ValidationException.class, () ->
                teamService.removeMember(orgId, "usr_dev_merchant_01", "mem_01")
        );
    }

    @Test
    void testPermissionAndMultiStoreAccessScoping() {
        String orgId = "org_varanasi_heritage";

        // Owner has all permissions
        assertTrue(teamService.hasPermission(orgId, "usr_dev_merchant_01", "store_varanasi_silk", PermissionCode.BILLING_MANAGE));
        assertTrue(teamService.hasPermission(orgId, "usr_dev_merchant_01", "store_varanasi_silk", PermissionCode.PRODUCT_DELETE));

        // Product Manager has PRODUCT_CREATE but not BILLING_MANAGE or ORDER_CANCEL
        assertTrue(teamService.hasPermission(orgId, "usr_dev_merchant_03", "store_varanasi_silk", PermissionCode.PRODUCT_CREATE));
        assertFalse(teamService.hasPermission(orgId, "usr_dev_merchant_03", "store_varanasi_silk", PermissionCode.BILLING_MANAGE));
        assertFalse(teamService.hasPermission(orgId, "usr_dev_merchant_03", "store_varanasi_silk", PermissionCode.ORDER_CANCEL));

        // Multi-store restriction test
        TeamMemberDto prodMgr = teamService.getTeamMembers(orgId).stream()
                .filter(m -> m.id().equals("mem_03"))
                .findFirst().get();

        // Restrict to store_varanasi_silk only
        teamService.updateMember(orgId, "usr_dev_merchant_01", "mem_03", new TeamMemberUpdateRequest(
                RoleCode.PRODUCT_MANAGER,
                StoreAccessType.SPECIFIC_STORES,
                List.of("store_varanasi_silk"),
                MemberStatus.ACTIVE
        ));

        assertTrue(teamService.hasPermission(orgId, "usr_dev_merchant_03", "store_varanasi_silk", PermissionCode.PRODUCT_CREATE));
        // Disallowed on another store
        assertFalse(teamService.hasPermission(orgId, "usr_dev_merchant_03", "store_other_heritage", PermissionCode.PRODUCT_CREATE));
    }
}
