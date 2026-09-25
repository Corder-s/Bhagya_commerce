package com.bhagya.commerce.notification.channel;

import java.util.Map;

public interface EmailProvider {
    String getProviderName();
    boolean sendEmail(String toEmail, String subject, String htmlBody, Map<String, Object> metadata);
}
