package com.bhagya.commerce.store.service;

import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.domain.StoreStatus;
import com.bhagya.commerce.store.dto.PublicStoreResponse;
import com.bhagya.commerce.store.dto.StoreCreateRequest;
import com.bhagya.commerce.store.dto.StoreResponse;
import com.bhagya.commerce.store.dto.StoreUpdateRequest;
import com.bhagya.commerce.store.repository.StoreRepository;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final OrganizationRepository organizationRepository;

    public StoreService(StoreRepository storeRepository, OrganizationRepository organizationRepository) {
        this.storeRepository = storeRepository;
        this.organizationRepository = organizationRepository;
    }

    public StoreResponse getStore(String storeId, String userId) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        if (!organizationRepository.isUserMember(store.getOrganizationId(), userId)) {
            throw new ForbiddenException("You are not authorized to manage this store.");
        }

        return toResponse(store);
    }

    public PublicStoreResponse getPublicStore(String storeId) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        if (store.getStatus() != StoreStatus.ACTIVE) {
            throw new ResourceNotFoundException("Store is currently not live.");
        }

        return toPublicResponse(store);
    }

    public PublicStoreResponse getPublicStoreBySlug(String slug) {
        Store store = storeRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with slug: " + slug));

        if (store.getStatus() != StoreStatus.ACTIVE) {
            throw new ResourceNotFoundException("Store is currently not live.");
        }

        return toPublicResponse(store);
    }

    public StoreResponse createStore(String userId, StoreCreateRequest request) {
        if (!organizationRepository.isUserMember(request.organizationId(), userId)) {
            throw new ForbiddenException("You are not authorized to create a store for this organization.");
        }

        if (storeRepository.existsBySlug(request.slug())) {
            throw new ConflictException("A store with this URL slug already exists. Please choose a different slug.");
        }

        Store store = new Store(
            "store_" + System.currentTimeMillis(),
            request.organizationId(),
            request.name(),
            request.slug(),
            request.craftCategory()
        );
        store.setStory(request.story());
        store.setLogoUrl(request.logoUrl());
        store.setBannerUrl(request.bannerUrl());
        store.setContactEmail(request.contactEmail());
        store.setContactPhone(request.contactPhone());
        storeRepository.save(store);

        return toResponse(store);
    }

    public StoreResponse updateStore(String storeId, String userId, StoreUpdateRequest request) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        if (!organizationRepository.isUserMember(store.getOrganizationId(), userId)) {
            throw new ForbiddenException("You are not authorized to update this store.");
        }

        if (request.name() != null) store.setName(request.name());
        if (request.craftCategory() != null) store.setCraftCategory(request.craftCategory());
        if (request.story() != null) store.setStory(request.story());
        if (request.logoUrl() != null) store.setLogoUrl(request.logoUrl());
        if (request.bannerUrl() != null) store.setBannerUrl(request.bannerUrl());
        if (request.status() != null) store.setStatus(request.status());
        if (request.contactEmail() != null) store.setContactEmail(request.contactEmail());
        if (request.contactPhone() != null) store.setContactPhone(request.contactPhone());
        store.setUpdatedAt(Instant.now());

        storeRepository.save(store);
        return toResponse(store);
    }

    public StoreResponse toResponse(Store store) {
        return new StoreResponse(
            store.getId(),
            store.getOrganizationId(),
            store.getName(),
            store.getSlug(),
            store.getCraftCategory(),
            store.getStory(),
            store.getLogoUrl(),
            store.getBannerUrl(),
            store.getStatus(),
            store.getContactEmail(),
            store.getContactPhone(),
            store.getCreatedAt()
        );
    }

    public PublicStoreResponse toPublicResponse(Store store) {
        return new PublicStoreResponse(
            store.getId(),
            store.getName(),
            store.getSlug(),
            store.getCraftCategory(),
            store.getStory(),
            store.getLogoUrl(),
            store.getBannerUrl()
        );
    }
}
