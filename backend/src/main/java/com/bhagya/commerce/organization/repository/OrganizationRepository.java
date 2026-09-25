package com.bhagya.commerce.organization.repository;

import com.bhagya.commerce.organization.domain.Organization;
import com.bhagya.commerce.organization.domain.OrganizationMember;
import com.bhagya.commerce.organization.domain.OrganizationRole;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class OrganizationRepository {

    private final Map<String, Organization> orgStorage = new ConcurrentHashMap<>();
    private final Map<String, OrganizationMember> memberStorage = new ConcurrentHashMap<>();

    public OrganizationRepository() {
        Organization defaultOrg = new Organization(
            "org_varanasi_heritage",
            "Varanasi Heritage Silks Group",
            "Varanasi Heritage Handlooms Pvt Ltd",
            "ABCDE1234F",
            "09ABCDE1234F1Z5"
        );
        save(defaultOrg);

        OrganizationMember member = new OrganizationMember(
            "mem_01",
            "org_varanasi_heritage",
            "usr_dev_merchant_01",
            OrganizationRole.STORE_OWNER
        );
        saveMember(member);
    }

    public Optional<Organization> findById(String id) {
        return Optional.ofNullable(orgStorage.get(id));
    }

    public Organization save(Organization org) {
        if (org.getId() == null) {
            org.setId("org_" + System.currentTimeMillis());
        }
        orgStorage.put(org.getId(), org);
        return org;
    }

    public OrganizationMember saveMember(OrganizationMember member) {
        if (member.getId() == null) {
            member.setId("mem_" + System.currentTimeMillis());
        }
        memberStorage.put(member.getId(), member);
        return member;
    }

    public List<OrganizationMember> findMembersByOrgId(String orgId) {
        return memberStorage.values().stream()
            .filter(m -> m.getOrganizationId().equals(orgId))
            .toList();
    }

    public boolean isUserMember(String orgId, String userId) {
        return memberStorage.values().stream()
            .anyMatch(m -> m.getOrganizationId().equals(orgId) && m.getUserId().equals(userId));
    }
}
