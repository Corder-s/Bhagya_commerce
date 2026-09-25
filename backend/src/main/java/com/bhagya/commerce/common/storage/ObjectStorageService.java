package com.bhagya.commerce.common.storage;

import java.io.InputStream;

/**
 * Storage abstraction for media and assets.
 * Step 11: In-memory/local abstraction boundary.
 * Step 12: Cloudflare R2 implementation.
 */
public interface ObjectStorageService {
    String uploadFile(String path, InputStream inputStream, String contentType, long contentLength);
    void deleteFile(String path);
    String getPublicUrl(String path);
}
