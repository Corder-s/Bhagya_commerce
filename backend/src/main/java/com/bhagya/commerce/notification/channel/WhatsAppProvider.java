package com.bhagya.commerce.notification.channel;

import java.util.Map;

public interface WhatsAppProvider {
    String getProviderName();
    boolean sendTemplateMessage(String toPhoneNumber, String templateName, Map<String, String> templateVariables);
}
