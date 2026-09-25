package com.bhagya.commerce.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "bhagya.payment")
public class PaymentProperties {
    private String provider = "mock"; // mock, razorpay, cashfree
    private String keyId = "rzp_test_bhagya_key";
    private String keySecret = "sample_key_secret";
    private String webhookSecret = "sample_webhook_secret";
    private int timeoutSeconds = 15;

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public String getKeySecret() { return keySecret; }
    public void setKeySecret(String keySecret) { this.keySecret = keySecret; }

    public String getWebhookSecret() { return webhookSecret; }
    public void setWebhookSecret(String webhookSecret) { this.webhookSecret = webhookSecret; }

    public int getTimeoutSeconds() { return timeoutSeconds; }
    public void setTimeoutSeconds(int timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }
}
