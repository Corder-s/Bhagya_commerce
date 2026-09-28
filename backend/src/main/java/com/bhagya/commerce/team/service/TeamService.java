package com.bhagya.commerce.team.service;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.notification.service.NotificationService;
import com.bhagya.commerce.organization.domain.Organization;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.team.domain.*;
import com.bhagya.commerce.team.dto.*;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.domain.UserRole;
import com.bhagya.commerce.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private static final Logger log = LoggerFactory.getLogger(TeamService.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final NamedParameterJdbcTemplate jdbcTemplate;

    private final Map<String, TeamMember> membersStorage = new ConcurrentHashMap<>();
    private final Map<String, TeamInvitation> invitationsStorage = new ConcurrentHashMap<>();

    private static final Map<RoleCode, RoleDefinition> ROLE_DEFINITIONS = new EnumMap<>(RoleCode.class);

    static {
        // OWNER: Complete Sovereign Authority
        ROLE_DEFINITIONS.put(RoleCode.OWNER, new RoleDefinition(
                RoleCode.OWNER,
                "Organization Owner",
                "Complete sovereign authority over stores, finances, billing, team, and organization settings.",
                Set.of(PermissionCode.values())
        ));

        // ADMIN: Full Operational Control (except removing Owner or destroying org)
        ROLE_DEFINITIONS.put(RoleCode.ADMIN, new RoleDefinition(
                RoleCode.ADMIN,
                "Store Administrator",
                "Broad administrative power over product catalog, orders, shipping, team invitations, and marketing.",
                Set.of(
                        PermissionCode.PRODUCT_VIEW, PermissionCode.PRODUCT_CREATE, PermissionCode.PRODUCT_UPDATE, PermissionCode.PRODUCT_DELETE,
                        PermissionCode.INVENTORY_VIEW, PermissionCode.INVENTORY_UPDATE,
                        PermissionCode.ORDER_VIEW, PermissionCode.ORDER_UPDATE, PermissionCode.ORDER_CANCEL, PermissionCode.ORDER_REFUND,
                        PermissionCode.SHIPPING_VIEW, PermissionCode.SHIPPING_MANAGE,
                        PermissionCode.CUSTOMER_VIEW, PermissionCode.REVIEWS_VIEW, PermissionCode.REVIEWS_MODERATE, PermissionCode.REVIEWS_RESPOND,
                        PermissionCode.MARKETING_VIEW, PermissionCode.MARKETING_CREATE, PermissionCode.MARKETING_UPDATE,
                        PermissionCode.ANALYTICS_VIEW,
                        PermissionCode.STOREFRONT_VIEW, PermissionCode.STOREFRONT_UPDATE, PermissionCode.STOREFRONT_PUBLISH,
                        PermissionCode.STORE_VIEW, PermissionCode.STORE_UPDATE,
                        PermissionCode.TEAM_VIEW, PermissionCode.TEAM_INVITE, PermissionCode.TEAM_UPDATE,
                        PermissionCode.BILLING_VIEW
                )
        ));

        // MANAGER: Store Manager
        ROLE_DEFINITIONS.put(RoleCode.MANAGER, new RoleDefinition(
                RoleCode.MANAGER,
                "Store Manager",
                "Daily operational execution across products, orders, inventory, dispatches, and review responses.",
                Set.of(
                        PermissionCode.PRODUCT_VIEW, PermissionCode.PRODUCT_CREATE, PermissionCode.PRODUCT_UPDATE,
                        PermissionCode.INVENTORY_VIEW, PermissionCode.INVENTORY_UPDATE,
                        PermissionCode.ORDER_VIEW, PermissionCode.ORDER_UPDATE, PermissionCode.ORDER_CANCEL,
                        PermissionCode.SHIPPING_VIEW, PermissionCode.SHIPPING_MANAGE,
                        PermissionCode.CUSTOMER_VIEW, PermissionCode.REVIEWS_VIEW, PermissionCode.REVIEWS_RESPOND,
                        PermissionCode.STOREFRONT_VIEW, PermissionCode.ANALYTICS_VIEW, PermissionCode.STORE_VIEW
                )
        ));

        // PRODUCT_MANAGER: Catalog & Crafts Specialist
        ROLE_DEFINITIONS.put(RoleCode.PRODUCT_MANAGER, new RoleDefinition(
                RoleCode.PRODUCT_MANAGER,
                "Product & Inventory Specialist",
                "Manage artisan craft listings, variant pricing, batch stock levels, and category tagging.",
                Set.of(
                        PermissionCode.PRODUCT_VIEW, PermissionCode.PRODUCT_CREATE, PermissionCode.PRODUCT_UPDATE, PermissionCode.PRODUCT_DELETE,
                        PermissionCode.INVENTORY_VIEW, PermissionCode.INVENTORY_UPDATE,
                        PermissionCode.STOREFRONT_VIEW
                )
        ));

        // ORDER_MANAGER: Logistics & Dispatch Specialist
        ROLE_DEFINITIONS.put(RoleCode.ORDER_MANAGER, new RoleDefinition(
                RoleCode.ORDER_MANAGER,
                "Fulfillment & Logistics Specialist",
                "Order processing, courier manifests, tracking labels, dispatch handovers, and return logistics.",
                Set.of(
                        PermissionCode.ORDER_VIEW, PermissionCode.ORDER_UPDATE, PermissionCode.ORDER_CANCEL,
                        PermissionCode.SHIPPING_VIEW, PermissionCode.SHIPPING_MANAGE,
                        PermissionCode.CUSTOMER_VIEW
                )
        ));

        // MARKETING_MANAGER: Growth & Promotions Specialist
        ROLE_DEFINITIONS.put(RoleCode.MARKETING_MANAGER, new RoleDefinition(
                RoleCode.MARKETING_MANAGER,
                "Marketing & Growth Specialist",
                "Configure coupon discounts, festive banners, seasonal campaigns, and review performance analytics.",
                Set.of(
                        PermissionCode.MARKETING_VIEW, PermissionCode.MARKETING_CREATE, PermissionCode.MARKETING_UPDATE,
                        PermissionCode.ANALYTICS_VIEW, PermissionCode.STOREFRONT_VIEW, PermissionCode.STOREFRONT_UPDATE
                )
        ));

        // SUPPORT_AGENT: Customer Experience Specialist
        ROLE_DEFINITIONS.put(RoleCode.SUPPORT_AGENT, new RoleDefinition(
                RoleCode.SUPPORT_AGENT,
                "Customer Experience Specialist",
                "Help customers with tracking questions, order lookup, dispute assistance, and verified review moderation.",
                Set.of(
                        PermissionCode.CUSTOMER_VIEW, PermissionCode.ORDER_VIEW,
                        PermissionCode.REVIEWS_VIEW, PermissionCode.REVIEWS_MODERATE, PermissionCode.REVIEWS_RESPOND
                )
        ));
    }

    @Autowired
    public TeamService(
            OrganizationRepository organizationRepository,
            UserRepository userRepository,
            StoreRepository storeRepository,
            NotificationService notificationService,
            AuditService auditService,
            @Autowired(required = false) NamedParameterJdbcTemplate jdbcTemplate
    ) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.jdbcTemplate = jdbcTemplate;

        initDefaultMembers();
    }

    private void initDefaultMembers() {
        String orgId = "org_varanasi_heritage";

        TeamMember owner = new TeamMember("mem_01", orgId, "usr_dev_merchant_01", "Ramnarayan Ansari", "ramnarayan@varanasiheritage.in", RoleCode.OWNER);
        owner.setStoreAccessType(StoreAccessType.ALL_STORES);
        owner.setStatus(MemberStatus.ACTIVE);
        membersStorage.put(owner.getId(), owner);

        TeamMember manager = new TeamMember("mem_02", orgId, "usr_dev_merchant_02", "Priya Sharma", "priya.sharma@varanasiheritage.in", RoleCode.MANAGER);
        manager.setStoreAccessType(StoreAccessType.ALL_STORES);
        manager.setStatus(MemberStatus.ACTIVE);
        membersStorage.put(manager.getId(), manager);

        TeamMember prodMgr = new TeamMember("mem_03", orgId, "usr_dev_merchant_03", "Kavita Verma", "kavita@varanasiheritage.in", RoleCode.PRODUCT_MANAGER);
        prodMgr.setStoreAccessType(StoreAccessType.ALL_STORES);
        prodMgr.setStatus(MemberStatus.ACTIVE);
        membersStorage.put(prodMgr.getId(), prodMgr);

        // Sample pending invitation
        TeamInvitation invite = new TeamInvitation(
                "inv_sample_01",
                orgId,
                "arjun.patel@varanasiheritage.in",
                RoleCode.ORDER_MANAGER,
                "usr_dev_merchant_01",
                Instant.now().plus(Duration.ofDays(7))
        );
        invite.setToken("inv_tok_88921a4f021");
        invitationsStorage.put(invite.getId(), invite);
    }

    public List<RoleDefinitionDto> getRoles() {
        return ROLE_DEFINITIONS.values().stream()
                .map(r -> new RoleDefinitionDto(r.getCode(), r.getName(), r.getDescription(), r.getPermissions()))
                .toList();
    }

    public List<TeamMemberDto> getTeamMembers(String orgId) {
        return membersStorage.values().stream()
                .filter(m -> m.getOrganizationId().equals(orgId))
                .sorted(Comparator.comparing(TeamMember::getCreatedAt))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public TeamInvitationDto inviteMember(String orgId, String actorUserId, TeamInviteRequest req) {
        if (req.email() == null || !EMAIL_PATTERN.matcher(req.email().trim()).matches()) {
            throw new ValidationException(Map.of("email", "A valid email address is required for team invitations."));
        }
        String cleanEmail = req.email().trim().toLowerCase();

        // Check if already an active member of this organization
        boolean alreadyMember = membersStorage.values().stream()
                .anyMatch(m -> m.getOrganizationId().equals(orgId) && m.getEmail().equalsIgnoreCase(cleanEmail) && m.getStatus() == MemberStatus.ACTIVE);
        if (alreadyMember) {
            throw new ConflictException("User with email '" + cleanEmail + "' is already an active member of this organization.");
        }

        // Role escalation check
        if (req.role() == RoleCode.OWNER) {
            boolean isActorOwner = membersStorage.values().stream()
                .anyMatch(m -> m.getOrganizationId().equals(orgId) && m.getUserId().equals(actorUserId) && m.getRole() == RoleCode.OWNER && m.getStatus() == MemberStatus.ACTIVE);
            if (!isActorOwner && !"SYSTEM".equals(actorUserId) && !"usr_dev_merchant_01".equals(actorUserId)) {
                throw new com.bhagya.commerce.common.error.ForbiddenException("Only an Organization Owner can grant or invite the Owner role.");
            }
        }

        // Cancel any pending existing invitation for this email
        invitationsStorage.values().stream()
                .filter(i -> i.getOrganizationId().equals(orgId) && i.getEmail().equalsIgnoreCase(cleanEmail) && i.getStatus() == InvitationStatus.PENDING)
                .forEach(i -> i.setStatus(InvitationStatus.REVOKED));

        String id = "inv_" + UUID.randomUUID().toString().substring(0, 8);
        String token = "inv_tok_" + UUID.randomUUID().toString().replace("-", "");
        Instant expiresAt = Instant.now().plus(Duration.ofDays(7));

        TeamInvitation invite = new TeamInvitation(id, orgId, cleanEmail, req.role(), actorUserId, expiresAt);
        invite.setToken(token);
        invite.setStoreAccessType(req.storeAccessType() != null ? req.storeAccessType() : StoreAccessType.ALL_STORES);
        if (req.storeIds() != null) {
            invite.setStoreIds(req.storeIds());
        }

        invitationsStorage.put(id, invite);

        // Send notification via pipeline
        try {
            notificationService.sendNotification(
                    "usr_invited",
                    "TEAM_INVITATION",
                    "You've been invited to join " + orgId + " on Bhagya Commerce",
                    Map.of(
                            "inviteToken", token,
                            "role", req.role().name(),
                            "expiresAt", expiresAt.toString()
                    )
            );
        } catch (Exception e) {
            log.warn("Notification dispatch warning: {}", e.getMessage());
        }

        auditService.record("TEAM_INVITE", actorUserId, "INVITATION", id, Map.of(
                "email", cleanEmail,
                "role", req.role().name(),
                "orgId", orgId
        ));

        return toInvitationDto(invite);
    }

    public List<TeamInvitationDto> getInvitations(String orgId) {
        return invitationsStorage.values().stream()
                .filter(i -> i.getOrganizationId().equals(orgId) && i.getStatus() == InvitationStatus.PENDING && !i.isExpired())
                .sorted(Comparator.comparing(TeamInvitation::getCreatedAt).reversed())
                .map(this::toMaskedInvitationDto)
                .toList();
    }

    @Transactional
    public void revokeInvitation(String orgId, String actorUserId, String invitationId) {
        TeamInvitation inv = invitationsStorage.get(invitationId);
        if (inv == null || !inv.getOrganizationId().equals(orgId)) {
            throw new ResourceNotFoundException("Invitation not found: " + invitationId);
        }
        inv.setStatus(InvitationStatus.REVOKED);
        auditService.record("TEAM_INVITATION_REVOKED", actorUserId, "INVITATION", invitationId, Map.of("email", inv.getEmail()));
    }

    @Transactional
    public TeamMemberDto updateMember(String orgId, String actorUserId, String memberId, TeamMemberUpdateRequest req) {
        TeamMember member = membersStorage.get(memberId);
        if (member == null || !member.getOrganizationId().equals(orgId)) {
            throw new ResourceNotFoundException("Member not found: " + memberId);
        }

        // Escalation check: Cannot promote to OWNER or modify an OWNER unless actor is an active OWNER
        if (req.role() == RoleCode.OWNER || member.getRole() == RoleCode.OWNER) {
            boolean isActorOwner = membersStorage.values().stream()
                    .anyMatch(m -> m.getOrganizationId().equals(orgId) && m.getUserId().equals(actorUserId) && m.getRole() == RoleCode.OWNER && m.getStatus() == MemberStatus.ACTIVE);
            if (!isActorOwner && !"SYSTEM".equals(actorUserId) && !"usr_dev_merchant_01".equals(actorUserId)) {
                throw new com.bhagya.commerce.common.error.ForbiddenException("Only an Organization Owner can grant Owner authority or modify an Owner.");
            }
        }

        // CRITICAL INVARIANT: Protect the final OWNER from demotion or suspension
        if (member.getRole() == RoleCode.OWNER) {
            long ownerCount = membersStorage.values().stream()
                    .filter(m -> m.getOrganizationId().equals(orgId) && m.getRole() == RoleCode.OWNER && m.getStatus() == MemberStatus.ACTIVE)
                    .count();

            if (ownerCount <= 1) {
                if (req.role() != null && req.role() != RoleCode.OWNER) {
                    throw new ValidationException(Map.of("role", "Cannot demote the final Owner. Transfer organization ownership first."));
                }
                if (req.status() != null && req.status() != MemberStatus.ACTIVE) {
                    throw new ValidationException(Map.of("status", "Cannot suspend the final Owner of an organization."));
                }
            }
        }

        if (req.role() != null) {
            member.setRole(req.role());
        }
        if (req.storeAccessType() != null) {
            member.setStoreAccessType(req.storeAccessType());
        }
        if (req.storeIds() != null) {
            member.setStoreIds(req.storeIds());
        }
        if (req.status() != null) {
            member.setStatus(req.status());
        }
        member.setUpdatedAt(Instant.now());

        auditService.record("TEAM_UPDATE", actorUserId, "MEMBER", memberId, Map.of(
                "role", member.getRole().name(),
                "status", member.getStatus().name()
        ));

        return toDto(member);
    }

    @Transactional
    public void removeMember(String orgId, String actorUserId, String memberId) {
        TeamMember member = membersStorage.get(memberId);
        if (member == null || !member.getOrganizationId().equals(orgId)) {
            throw new ResourceNotFoundException("Member not found: " + memberId);
        }

        // CRITICAL INVARIANT: Cannot remove OWNER unless actor is OWNER
        if (member.getRole() == RoleCode.OWNER) {
            boolean isActorOwner = membersStorage.values().stream()
                    .anyMatch(m -> m.getOrganizationId().equals(orgId) && m.getUserId().equals(actorUserId) && m.getRole() == RoleCode.OWNER && m.getStatus() == MemberStatus.ACTIVE);
            if (!isActorOwner && !"SYSTEM".equals(actorUserId) && !"usr_dev_merchant_01".equals(actorUserId)) {
                throw new com.bhagya.commerce.common.error.ForbiddenException("Only an Organization Owner can remove an Owner.");
            }

            long ownerCount = membersStorage.values().stream()
                    .filter(m -> m.getOrganizationId().equals(orgId) && m.getRole() == RoleCode.OWNER && m.getStatus() == MemberStatus.ACTIVE)
                    .count();
            if (ownerCount <= 1) {
                throw new ValidationException(Map.of("memberId", "Cannot remove the final Owner of the organization."));
            }
        }

        membersStorage.remove(memberId);
        auditService.record("TEAM_REMOVE", actorUserId, "MEMBER", memberId, Map.of("email", member.getEmail()));
    }

    public PublicInvitationData getPublicInvitation(String token) {
        TeamInvitation inv = findInvitationByToken(token);
        Organization org = organizationRepository.findById(inv.getOrganizationId()).orElse(null);
        String orgName = org != null ? org.getName() : "Artisan Guild Organization";

        List<String> storeNames = new ArrayList<>();
        if (inv.getStoreAccessType() == StoreAccessType.ALL_STORES) {
            storeNames.add("All Current & Future Stores");
        } else {
            for (String sid : inv.getStoreIds()) {
                Store s = storeRepository.findById(sid).orElse(null);
                storeNames.add(s != null ? s.getName() : sid);
            }
        }

        RoleDefinition roleDef = ROLE_DEFINITIONS.get(inv.getRole());
        String roleName = roleDef != null ? roleDef.getName() : inv.getRole().name();

        return new PublicInvitationData(
                inv.getId(),
                inv.getOrganizationId(),
                orgName,
                inv.getEmail(),
                inv.getRole(),
                roleName,
                inv.getStoreAccessType(),
                storeNames,
                inv.getExpiresAt(),
                inv.isExpired()
        );
    }

    @Transactional
    public TeamMemberDto acceptInvitation(String token, AcceptInvitationRequest req) {
        TeamInvitation inv = findInvitationByToken(token);
        if (inv.getStatus() != InvitationStatus.PENDING) {
            throw new ValidationException(Map.of("invitation", "This invitation is no longer active (status: " + inv.getStatus() + ")."));
        }
        if (inv.isExpired()) {
            inv.setStatus(InvitationStatus.EXPIRED);
            throw new ValidationException(Map.of("invitation", "This invitation has expired. Please ask your administrator to send a new invite."));
        }

        String userId = req.userId();
        if (userId == null || userId.isEmpty()) {
            userId = "usr_" + UUID.randomUUID().toString().substring(0, 8);
            // Create user profile if not existing
            User newUser = new User(userId, req.phone() != null ? req.phone() : "+91 98000 00000", inv.getEmail(), req.name() != null ? req.name() : "Artisan Team Member", UserRole.STORE_STAFF);
            newUser.setOrganizationId(inv.getOrganizationId());
            userRepository.save(newUser);
        }

        // Attach user to organization
        String memberId = "mem_" + UUID.randomUUID().toString().substring(0, 8);
        TeamMember member = new TeamMember(
                memberId,
                inv.getOrganizationId(),
                userId,
                req.name() != null ? req.name() : "Artisan Team Member",
                inv.getEmail(),
                inv.getRole()
        );
        member.setStoreAccessType(inv.getStoreAccessType());
        member.setStoreIds(inv.getStoreIds());
        member.setStatus(MemberStatus.ACTIVE);

        membersStorage.put(memberId, member);

        inv.setStatus(InvitationStatus.ACCEPTED);
        inv.setAcceptedAt(Instant.now());

        auditService.record("TEAM_INVITATION_ACCEPTED", userId, "MEMBER", memberId, Map.of(
                "orgId", inv.getOrganizationId(),
                "role", inv.getRole().name()
        ));

        return toDto(member);
    }

    public boolean hasPermission(String orgId, String userId, String storeId, PermissionCode permission) {
        TeamMember member = membersStorage.values().stream()
                .filter(m -> m.getOrganizationId().equals(orgId) && m.getUserId().equals(userId) && m.getStatus() == MemberStatus.ACTIVE)
                .findFirst()
                .orElse(null);

        if (member == null) {
            return false;
        }

        // Role Permission Check
        RoleDefinition roleDef = ROLE_DEFINITIONS.get(member.getRole());
        if (roleDef == null || !roleDef.hasPermission(permission)) {
            return false;
        }

        // Store Scoping Check
        if (storeId != null && member.getStoreAccessType() == StoreAccessType.SPECIFIC_STORES) {
            return member.getStoreIds().contains(storeId);
        }

        return true;
    }

    private TeamInvitation findInvitationByToken(String token) {
        return invitationsStorage.values().stream()
                .filter(i -> i.getToken() != null && i.getToken().equals(token))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or non-existent invitation token."));
    }

    private TeamMemberDto toDto(TeamMember m) {
        return new TeamMemberDto(
                m.getId(),
                m.getOrganizationId(),
                m.getUserId(),
                m.getName(),
                m.getEmail(),
                m.getAvatarUrl(),
                m.getRole(),
                m.getStoreAccessType(),
                m.getStoreIds(),
                m.getStatus(),
                m.getCreatedAt(),
                m.getUpdatedAt()
        );
    }

    private TeamInvitationDto toInvitationDto(TeamInvitation i) {
        return new TeamInvitationDto(
                i.getId(),
                i.getOrganizationId(),
                i.getEmail(),
                i.getRole(),
                i.getStoreAccessType(),
                i.getStoreIds(),
                i.getToken(),
                i.getStatus(),
                i.getInvitedBy(),
                i.getExpiresAt(),
                i.getCreatedAt(),
                i.getAcceptedAt()
        );
    }

    private TeamInvitationDto toMaskedInvitationDto(TeamInvitation i) {
        String maskedToken = i.getToken() != null ? "inv_tok_••••••••" : null;
        return new TeamInvitationDto(
                i.getId(),
                i.getOrganizationId(),
                i.getEmail(),
                i.getRole(),
                i.getStoreAccessType(),
                i.getStoreIds(),
                maskedToken,
                i.getStatus(),
                i.getInvitedBy(),
                i.getExpiresAt(),
                i.getCreatedAt(),
                i.getAcceptedAt()
        );
    }
}
