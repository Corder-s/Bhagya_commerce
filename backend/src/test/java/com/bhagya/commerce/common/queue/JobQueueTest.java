package com.bhagya.commerce.common.queue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class JobQueueTest {

    private JobQueue jobQueue;

    @BeforeEach
    void setUp() {
        jobQueue = new JobQueue(null);
    }

    @Test
    @DisplayName("Should enqueue and dequeue background job messages")
    void testEnqueueDequeue() {
        JobMessage job = JobMessage.create(
            "job_101",
            JobType.SEND_NOTIFICATION,
            Map.of("userId", "usr_1", "title", "Order Dispatched", "orderId", "ord_101")
        );

        jobQueue.enqueue(job);
        assertEquals(1, jobQueue.size());

        Optional<JobMessage> dequeued = jobQueue.dequeue();
        assertTrue(dequeued.isPresent());
        assertEquals("job_101", dequeued.get().id());
        assertEquals(JobType.SEND_NOTIFICATION, dequeued.get().type());
        assertEquals(0, dequeued.get().attemptCount());

        JobMessage nextAttempt = dequeued.get().withIncrementedAttempt();
        assertEquals(1, nextAttempt.attemptCount());
    }
}
