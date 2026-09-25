package com.bhagya.commerce.common.storage;

import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.storage.dto.MediaCompleteRequest;
import com.bhagya.commerce.common.storage.dto.MediaResponse;
import com.bhagya.commerce.common.storage.dto.UploadUrlRequest;
import com.bhagya.commerce.common.storage.dto.UploadUrlResponse;
import java.io.InputStream;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
public class R2StorageService implements ObjectStorageService {

    private static final Logger log = LoggerFactory.getLogger(R2StorageService.class);

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/avif"
    );

    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_DOC_SIZE = 25 * 1024 * 1024;   // 25MB

    private final R2Properties properties;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    // PostgreSQL metadata mock storage for Step 12 local test / in-memory compatibility
    private final Map<String, MediaResponse> mediaMetadataStore = new ConcurrentHashMap<>();

    public R2StorageService(
        R2Properties properties,
        @Autowired(required = false) S3Client s3Client,
        @Autowired(required = false) S3Presigner s3Presigner
    ) {
        this.properties = properties;
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    public UploadUrlResponse generatePresignedUploadUrl(UploadUrlRequest request, String storeId) {
        // Validate MIME type and size
        if (!ALLOWED_IMAGE_TYPES.contains(request.contentType()) && !"application/pdf".equals(request.contentType())) {
            throw new ValidationException(Map.of("contentType", "Unsupported file type: " + request.contentType()));
        }

        long maxSize = "application/pdf".equals(request.contentType()) ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
        if (request.sizeBytes() > maxSize) {
            throw new ValidationException(Map.of("sizeBytes", "File exceeds maximum permitted size of " + (maxSize / (1024 * 1024)) + "MB"));
        }

        String sanitizedFilename = request.filename().replaceAll("[^a-zA-Z0-9.-]", "_");
        String objectKey = generateObjectKey(storeId, request.entityType(), request.entityId(), sanitizedFilename);
        String publicUrl = properties.getPublicBaseUrl().replaceAll("/+$", "") + "/" + objectKey;
        Instant expiresAt = Instant.now().plus(Duration.ofMinutes(15));

        String uploadUrl;
        if (s3Presigner != null) {
            try {
                PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(properties.getBucketName())
                    .key(objectKey)
                    .contentType(request.contentType())
                    .build();

                PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .putObjectRequest(putRequest)
                    .build();

                PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
                uploadUrl = presigned.url().toString();
            } catch (Exception e) {
                log.warn("Failed to generate real R2 presigned URL: {}, returning fallback dev URL", e.getMessage());
                uploadUrl = properties.getEndpointUrl() + "/" + properties.getBucketName() + "/" + objectKey + "?token=dev_presigned_upload";
            }
        } else {
            uploadUrl = properties.getEndpointUrl() + "/" + properties.getBucketName() + "/" + objectKey + "?token=dev_presigned_upload";
        }

        return new UploadUrlResponse(uploadUrl, objectKey, publicUrl, expiresAt);
    }

    public MediaResponse confirmMediaUpload(MediaCompleteRequest request) {
        String id = "med_" + UUID.randomUUID().toString().substring(0, 8);
        String publicUrl = properties.getPublicBaseUrl().replaceAll("/+$", "") + "/" + request.objectKey();

        MediaResponse response = new MediaResponse(
            id,
            request.entityType(),
            request.entityId(),
            request.objectKey(),
            publicUrl,
            request.mimeType(),
            request.sizeBytes(),
            request.altText(),
            request.sortOrder(),
            request.isPrimary(),
            Instant.now()
        );

        mediaMetadataStore.put(id, response);
        log.info("[R2] Confirmed media upload id={} entityId={} key={}", id, request.entityId(), request.objectKey());
        return response;
    }

    public List<MediaResponse> getMediaForEntity(String entityId) {
        return mediaMetadataStore.values().stream()
            .filter(m -> m.entityId().equals(entityId))
            .sorted((a, b) -> Integer.compare(a.sortOrder(), b.sortOrder()))
            .toList();
    }

    @Override
    public String uploadFile(String path, InputStream inputStream, String contentType, long contentLength) {
        if (s3Client != null) {
            try {
                PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(properties.getBucketName())
                    .key(path)
                    .contentType(contentType)
                    .build();

                s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, contentLength));
            } catch (Exception e) {
                log.warn("R2 upload error for key={}: {}", path, e.getMessage());
            }
        }
        return getPublicUrl(path);
    }

    @Override
    public void deleteFile(String path) {
        if (s3Client != null) {
            try {
                DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(properties.getBucketName())
                    .key(path)
                    .build();
                s3Client.deleteObject(deleteRequest);
            } catch (Exception e) {
                log.warn("R2 delete error for key={}: {}", path, e.getMessage());
            }
        }
        mediaMetadataStore.values().removeIf(m -> m.objectKey().equals(path));
    }

    @Override
    public String getPublicUrl(String path) {
        return properties.getPublicBaseUrl().replaceAll("/+$", "") + "/" + path;
    }

    private String generateObjectKey(String storeId, String entityType, String entityId, String filename) {
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return switch (entityType.toUpperCase()) {
            case "PRODUCT" -> "stores/" + storeId + "/products/" + entityId + "/original/" + uuid + "-" + filename;
            case "STORE_LOGO" -> "stores/" + storeId + "/branding/logo/" + uuid + "-" + filename;
            case "STORE_BANNER" -> "stores/" + storeId + "/branding/banner/" + uuid + "-" + filename;
            case "DOCUMENT" -> "stores/" + storeId + "/documents/" + uuid + "-" + filename;
            default -> "stores/" + storeId + "/misc/" + uuid + "-" + filename;
        };
    }
}
