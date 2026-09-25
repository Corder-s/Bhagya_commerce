package com.bhagya.commerce.user.service;

import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.dto.UserPreferencesRequest;
import com.bhagya.commerce.user.dto.UserPreferencesResponse;
import com.bhagya.commerce.user.dto.UserResponse;
import com.bhagya.commerce.user.dto.UserUpdateRequest;
import com.bhagya.commerce.user.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Map<String, UserPreferencesResponse> preferencesStorage = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return toResponse(user);
    }

    public UserResponse updateUserProfile(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) user.setEmail(request.email());
        if (request.avatarUrl() != null) user.setAvatarUrl(request.avatarUrl());
        user.setUpdatedAt(Instant.now());

        userRepository.save(user);
        return toResponse(user);
    }

    public UserPreferencesResponse getUserPreferences(String userId) {
        return preferencesStorage.computeIfAbsent(userId, id -> new UserPreferencesResponse(
            id, "en", true, true, false, List.of("Handloom & Textiles", "Brassware & Metalcraft")
        ));
    }

    public UserPreferencesResponse updateUserPreferences(String userId, UserPreferencesRequest request) {
        UserPreferencesResponse response = new UserPreferencesResponse(
            userId,
            request.preferredLanguage() != null ? request.preferredLanguage() : "en",
            request.orderStatusSms(),
            request.orderStatusWhatsapp(),
            request.promotionalEmails(),
            request.favoriteCraftCategories() != null ? request.favoriteCraftCategories() : List.of()
        );
        preferencesStorage.put(userId, response);
        return response;
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getPhone(),
            user.getEmail(),
            user.getName(),
            user.getAvatarUrl(),
            user.getRole(),
            user.getStoreId(),
            user.getOrganizationId(),
            user.getCreatedAt()
        );
    }
}
