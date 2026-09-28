package com.bhagya.commerce.export.dto;

import com.bhagya.commerce.export.domain.ExportJob;
import java.time.Instant;

public record ExportJobResponse(
    String id,
    String storeId,
    String exportType,
    String status,
    String fileUrl,
    String errorMessage,
    Instant createdAt,
    Instant completedAt
) {
    public static ExportJobResponse fromDomain(ExportJob job) {
        return new ExportJobResponse(
            job.getId(),
            job.getStoreId(),
            job.getExportType(),
            job.getStatus(),
            job.getFileUrl(),
            job.getErrorMessage(),
            job.getCreatedAt(),
            job.getCompletedAt()
        );
    }
}
