package com.bhagya.commerce.notification.channel;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("mockEmailProvider")
public class MockEmailProvider implements EmailProvider {

    private static final Logger log = LoggerFactory.getLogger(MockEmailProvider.class);

    @Override
    public String getProviderName() {
        return "MOCK_EMAIL";
    }

    @Override
    public boolean sendEmail(String toEmail, String subject, String htmlBody, Map<String, Object> metadata) {
        log.info("[MOCK_EMAIL] Sent to={} subject='{}' bodyLength={}", toEmail, subject, htmlBody != null ? htmlBody.length() : 0);
        return true;
    }
}
