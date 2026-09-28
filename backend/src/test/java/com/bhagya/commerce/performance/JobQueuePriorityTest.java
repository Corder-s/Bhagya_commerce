package com.bhagya.commerce.performance;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.common.queue.JobMessage;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.queue.JobType;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JobQueuePriorityTest {

    private JobQueue jobQueue;

    @BeforeEach
    void setUp() {
        jobQueue = new JobQueue(null);
    }

    @Test
    @DisplayName("[QUEUE PRIORITY] Critical transactional notifications bypass background export jobs")
    void testCriticalPriorityOverBulk() {
        // Enqueue bulk jobs first
        JobMessage bulkReport1 = JobMessage.create("job_bulk_1", JobType.GENERATE_REPORT, Map.of("task", "export_csv"));
        JobMessage bulkAnalytics2 = JobMessage.create("job_bulk_2", JobType.ANALYTICS_EVENT, Map.of("task", "aggregate"));
        jobQueue.enqueue(bulkReport1);
        jobQueue.enqueue(bulkAnalytics2);

        // Enqueue urgent transactional customer notification last
        JobMessage urgentEmail = JobMessage.create("job_urgent_email", JobType.SEND_EMAIL, Map.of("to", "customer@bhagya.com"));
        jobQueue.enqueue(urgentEmail);

        // First dequeue must return the critical email despite being enqueued later!
        Optional<JobMessage> firstOut = jobQueue.dequeue();
        assertTrue(firstOut.isPresent());
        assertEquals("job_urgent_email", firstOut.get().id());
        assertEquals(JobType.SEND_EMAIL, firstOut.get().type());

        // Subsequent dequeues return the bulk jobs
        Optional<JobMessage> secondOut = jobQueue.dequeue();
        assertTrue(secondOut.isPresent());
        assertEquals("job_bulk_1", secondOut.get().id());

        Optional<JobMessage> thirdOut = jobQueue.dequeue();
        assertTrue(thirdOut.isPresent());
        assertEquals("job_bulk_2", thirdOut.get().id());

        // Queue now empty
        assertTrue(jobQueue.dequeue().isEmpty());
    }

    @Test
    @DisplayName("[BACKPRESSURE] Queue size tracking across critical and bulk queues")
    void testQueueSizeTracking() {
        jobQueue.enqueue(JobMessage.create("c1", JobType.SEND_SMS, Map.of()));
        jobQueue.enqueue(JobMessage.create("c2", JobType.SEND_WHATSAPP, Map.of()));
        jobQueue.enqueue(JobMessage.create("b1", JobType.GENERATE_REPORT, Map.of()));

        assertEquals(2, jobQueue.criticalSize());
        assertEquals(1, jobQueue.bulkSize());
        assertEquals(3, jobQueue.size());
    }
}
