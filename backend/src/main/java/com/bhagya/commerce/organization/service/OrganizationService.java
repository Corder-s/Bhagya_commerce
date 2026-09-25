package com.bhagya.commerce.organization.service;

import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.organization.domain.Organization;
import com.bhagya.commerce.organization.domain.OrganizationMember;
import com.bhagya.commerce.organization.domain.OrganizationRole;
import com.bhagya.commerce.organization.dto.OrganizationCreateRequest;
import com.bhagya.commerce.organization.dto.OrganizationResponse;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public OrganizationResponse getOrganization(String orgId, String userId) {
        if (!organizationRepository.isUserMember(orgId, userId)) {
            throw new ForbiddenException("You are not authorized to view this organization.");
        }

        Organization org = organizationRepository.findById(orgId)
            .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + orgId));

        return toResponse(org);
    }

    public OrganizationResponse createOrganization(String userId, OrganizationCreateRequest request) {
        Organization org = new Organization(
            "org_" + System.currentTimeMillis(),
            request.name(),
            request.legalName(),
            request.panNumber(),
            request.gstin()
        );
        organizationRepository.save(org);

        // Assign user as store owner
        OrganizationMember member = new OrganizationMember(
            "mem_" + System.currentTimeMillis(),
            org.getId(),
            userId,
            OrganizationRole.STORE_OWNER
        );
        organizationRepository.saveMember(member);

        return toResponse(org);
    }

    public List<OrganizationMember> getMembers(String orgId, String userId) {
        if (!organizationRepository.isUserMember(orgId, userId)) {
            throw new ForbiddenException("You are not authorized to view organization members.");
        }
        return organizationRepository.findMembersByOrgId(orgId);
    }

    public OrganizationResponse toResponse(Organization org) {
        return new OrganizationResponse(
            org.getId(),
            org.getName(),
            org.getLegalName(),
            org.getPanNumber(),
            org.getGstin(),
            org.getCreatedAt()
        );
    }
}
