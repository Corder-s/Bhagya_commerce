package com.bhagya.commerce.common.storage;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.storage.dto.MediaCompleteRequest;
import com.bhagya.commerce.common.storage.dto.MediaResponse;
import com.bhagya.commerce.common.storage.dto.UploadUrlRequest;
import com.bhagya.commerce.common.storage.dto.UploadUrlResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class R2StorageServiceTest {

    private R2StorageService r2StorageService;

    @BeforeEach
    void setUp() {
        R2Properties properties = new R2Properties();
        properties.setAccountId("test-account-id");
        properties.setBucketName("test-bucket");
        properties.setPublicBaseUrl("https://media.bhagya.commerce");

        r2StorageService = new R2StorageService(properties, null, null);
    }

    @Test
    @DisplayName("Should generate structured upload URL for valid product image")
    void testValidPresignedUploadUrl() {
        UploadUrlRequest request = new UploadUrlRequest(
            "banarasi-saree.webp",
            "image/webp",
            1024 * 1024,
            "PRODUCT",
            "prod_101"
        );

        UploadUrlResponse response = r2StorageService.generatePresignedUploadUrl(request, "store_1");
        assertNotNull(response);
        assertNotNull(response.uploadUrl());
        assertTrue(response.objectKey().startsWith("stores/store_1/products/prod_101/original/"));
        assertTrue(response.publicUrl().contains("https://media.bhagya.commerce"));
    }

    @Test
    @DisplayName("Should reject invalid MIME types")
    void testInvalidMimeTypeThrowsException() {
        UploadUrlRequest request = new UploadUrlRequest(
            "script.exe",
            "application/x-msdownload",
            5000,
            "PRODUCT",
            "prod_101"
        );

        assertThrows(ValidationException.class, () -> {
            r2StorageService.generatePresignedUploadUrl(request, "store_1");
        });
    }

    @Test
    @DisplayName("Should register confirmed upload metadata")
    void testConfirmMediaUpload() {
        MediaCompleteRequest request = new MediaCompleteRequest(
            "stores/store_1/products/prod_101/original/img.webp",
            "PRODUCT",
            "prod_101",
            102400,
            "image/webp",
            "GI Handloom Banarasi Saree",
            0,
            true
        );

        MediaResponse response = r2StorageService.confirmMediaUpload(request);
        assertNotNull(response);
        assertNotNull(response.id());
        assertEquals("prod_101", response.entityId());
        assertTrue(response.isPrimary());
    }
}
