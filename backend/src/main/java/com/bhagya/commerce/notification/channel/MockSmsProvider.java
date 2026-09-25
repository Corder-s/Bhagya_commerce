package com.bhagya.commerce.notification.channel;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("mockSmsProvider")
public class MockSmsProvider implements SmsProvider {

    private static final Logger log = LoggerFactory.getLogger(MockSmsProvider.class);

    @Override
    public String getProviderName() {
        return "MOCK_SMS";
    }

    @Override
    public boolean sendSms(String toPhoneNumber, String message) {
        log.info("[MOCK_SMS] Sent to={} msg='{}'", toPhoneNumber, message);
        return true;
    }
}
