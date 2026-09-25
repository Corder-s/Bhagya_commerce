package com.bhagya.commerce.common.storage.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.common.storage.R2StorageService;
import com.bhagya.commerce.common.storage.dto.MediaCompleteRequest;
import com.bhagya.commerce.common.storage.dto.MediaResponse;
import com.bhagya.commerce.common.storage.dto.UploadUrlRequest;
import com.bhagya.commerce.common.storage.dto.UploadUrlResponse;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.store.domain.Store;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/media")
@Tag(name = "Media & Object Storage", description = "Cloudflare R2 Presigned Upload & Asset Management APIs")
public class MediaController {

    private final R2StorageService r2StorageService;
    private final MerchantService merchantService;

    public MediaController(R2StorageService r2StorageService, MerchantService merchantService) {
        this.r2StorageService = r2StorageService;
        this.merchantService = merchantService;
    }

    @PostMapping("/upload-url")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Generate presigned Cloudflare R2 upload URL", description = "Generates a secure, temporary PUT URL allowing direct browser-to-R2 upload")
    public ResponseEntity<ApiResponse<UploadUrlResponse>> getPresignedUploadUrl(
        @Valid @RequestBody UploadUrlRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        Store store = merchantService.getStoreForUser(principal.getId());
        UploadUrlResponse response = r2StorageService.generatePresignedUploadUrl(request, store.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Presigned upload URL generated successfully"));
    }

    @PostMapping("/complete")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Confirm media upload completion", description = "Saves object metadata in PostgreSQL and associates asset with entity")
    public ResponseEntity<ApiResponse<MediaResponse>> completeMediaUpload(
        @Valid @RequestBody MediaCompleteRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        // Verify merchant store access
        merchantService.getStoreForUser(principal.getId());
        MediaResponse response = r2StorageService.confirmMediaUpload(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Media asset registered successfully"));
    }

    @DeleteMapping("/{mediaId}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Delete media asset", description = "Removes file from Cloudflare R2 and deletes PostgreSQL metadata record")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(
        @PathVariable String mediaId,
        @CurrentUser UserPrincipal principal
    ) {
        merchantService.getStoreForUser(principal.getId());
        r2StorageService.deleteFile(mediaId);
        return ResponseEntity.ok(ApiResponse.success(null, "Media asset deleted"));
    }
}
