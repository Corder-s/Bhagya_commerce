package com.bhagya.commerce.export.domain;

import java.time.Instant;

public class ExportJob {
    private String id;
    private String storeId;
    private String userId;
    private String exportType;
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED
    private String fileUrl;
    private String errorMessage;
    private Instant createdAt;
    private Instant completedAt;

    public ExportJob() {}

    public ExportJob(String id, String storeId, String userId, String exportType) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.exportType = exportType;
        this.status = "PENDING";
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getExportType() { return exportType; }
    public void setExportType(String exportType) { this.exportType = exportType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
