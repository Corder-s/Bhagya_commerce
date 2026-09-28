package com.bhagya.commerce.export.service;

import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.queue.JobMessage;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.queue.JobType;
import com.bhagya.commerce.export.domain.ExportJob;
import com.bhagya.commerce.export.dto.ExportJobResponse;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ExportJobService {

    private static final Logger log = LoggerFactory.getLogger(ExportJobService.class);

    private final JobQueue jobQueue;
    private final AnalyticsAggregationService aggregationService;
    private final Map<String, ExportJob> jobStorage = new ConcurrentHashMap<>();

    public ExportJobService(JobQueue jobQueue, AnalyticsAggregationService aggregationService) {
        this.jobQueue = jobQueue;
        this.aggregationService = aggregationService;
    }

    public ExportJobResponse createAnalyticsExportJob(
        String storeId,
        String userId,
        String period,
        Instant start,
        Instant end
    ) {
        String jobId = "exp_" + UUID.randomUUID().toString().substring(0, 10);
        ExportJob job = new ExportJob(jobId, storeId, userId, "ANALYTICS_CSV");
        jobStorage.put(jobId, job);

        // Enqueue to background bulk queue
        JobMessage message = JobMessage.create(
            "job_exp_" + jobId,
            JobType.GENERATE_REPORT,
            Map.of(
                "jobId", jobId,
                "storeId", storeId,
                "userId", userId,
                "period", period != null ? period : "30d"
            )
        );
        jobQueue.enqueue(message);
        log.info("[EXPORT] Enqueued background analytics export jobId={} for storeId={}", jobId, storeId);

        // Immediately simulate / execute worker background generation
        processExportInBackground(job, storeId, period, start, end);

        return ExportJobResponse.fromDomain(job);
    }

    private void processExportInBackground(ExportJob job, String storeId, String period, Instant start, Instant end) {
        // Asynchronously process report to avoid blocking request thread
        Thread.startVirtualThread(() -> {
            try {
                job.setStatus("PROCESSING");
                String csv = aggregationService.exportMerchantAnalyticsCsv(storeId, period, start, end);
                // Simulated R2 object storage key
                String fileUrl = "/api/v1/merchant/stores/" + storeId + "/analytics/export?period=" + (period != null ? period : "30d");
                job.setStatus("COMPLETED");
                job.setFileUrl(fileUrl);
                job.setCompletedAt(Instant.now());
                log.info("[EXPORT] Completed export jobId={} bytes={}", job.getId(), csv.length());
            } catch (Exception e) {
                log.error("[EXPORT] Failed export jobId={}: {}", job.getId(), e.getMessage());
                job.setStatus("FAILED");
                job.setErrorMessage(e.getMessage());
                job.setCompletedAt(Instant.now());
            }
        });
    }

    public ExportJobResponse getJobStatus(String storeId, String jobId, String userId) {
        ExportJob job = jobStorage.get(jobId);
        if (job == null) {
            throw new ResourceNotFoundException("Export job not found: " + jobId);
        }
        if (!job.getStoreId().equals(storeId)) {
            throw new ForbiddenException("Unauthorized to access export job from another store.");
        }
        return ExportJobResponse.fromDomain(job);
    }
}
