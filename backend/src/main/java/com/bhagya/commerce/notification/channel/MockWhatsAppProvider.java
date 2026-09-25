package com.bhagya.commerce.notification.channel;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("mockWhatsAppProvider")
public class MockWhatsAppProvider implements WhatsAppProvider {

    private static final Logger log = LoggerFactory.getLogger(MockWhatsAppProvider.class);

    @Override
    public String getProviderName() {
        return "MOCK_WHATSAPP";
    }

    @Override
    public boolean sendTemplateMessage(String toPhoneNumber, String templateName, Map<String, String> templateVariables) {
        log.info("[MOCK_WHATSAPP] Sent to={} template={} vars={}", toPhoneNumber, templateName, templateVariables);
        return true;
    }
}
