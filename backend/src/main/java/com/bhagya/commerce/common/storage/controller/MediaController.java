package com.bhagya.commerce.common.storage.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.common.storage.R2StorageService;
import com.bhagya.commerce.common.storage.dto.MediaCompleteRequest;
import com.bhagya.commerce.common.storage.dto.MediaResponse;
import com.bhagya.commerce.common.storage.dto.UploadUrlRequest;
import com.bhagya.commerce.common.storage.dto.UploadUrlResponse;
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
@Tag(name = "Media & Object Storage", description = "Cloudflare R2 Presigned Upload & Asset Management with strict tenant isolation")
public class MediaController {

    private final R2StorageService r2StorageService;
    private final TenantSecurityService tenantSecurityService;

    public MediaController(R2StorageService r2StorageService, TenantSecurityService tenantSecurityService) {
        this.r2StorageService = r2StorageService;
        this.tenantSecurityService = tenantSecurityService;
    }

    @PostMapping("/upload-url")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
    @Operation(summary = "Generate presigned Cloudflare R2 upload URL", description = "Generates a secure, temporary PUT URL scoped to tenant store prefix")
    public ResponseEntity<ApiResponse<UploadUrlResponse>> getPresignedUploadUrl(
        @Valid @RequestBody UploadUrlRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = tenantSecurityService.resolveAuthoritativeStoreId(principal, null);
        UploadUrlResponse response = r2StorageService.generatePresignedUploadUrl(request, storeId);
        return ResponseEntity.ok(ApiResponse.success(response, "Presigned upload URL generated successfully"));
    }

    @PostMapping("/complete")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
    @Operation(summary = "Confirm media upload completion with tenant scope verification", description = "Saves object metadata in PostgreSQL after validating tenant object prefix")
    public ResponseEntity<ApiResponse<MediaResponse>> completeMediaUpload(
        @Valid @RequestBody MediaCompleteRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = tenantSecurityService.resolveAuthoritativeStoreId(principal, null);
        // Strictly verify that the uploaded object key resides inside this store's tenant namespace
        tenantSecurityService.validateObjectKeyTenantScope(storeId, request.objectKey());

        MediaResponse response = r2StorageService.confirmMediaUpload(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Media asset registered successfully"));
    }

    @DeleteMapping("/{mediaId}")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
    @Operation(summary = "Delete media asset", description = "Removes file from Cloudflare R2 and deletes PostgreSQL metadata record")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(
        @PathVariable String mediaId,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = tenantSecurityService.resolveAuthoritativeStoreId(principal, null);
        // Scoped deletion
        r2StorageService.deleteFile("stores/" + storeId + "/" + mediaId);
        return ResponseEntity.ok(ApiResponse.success(null, "Media asset deleted"));
    }
}
