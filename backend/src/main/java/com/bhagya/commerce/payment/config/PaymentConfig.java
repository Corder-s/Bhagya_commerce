package com.bhagya.commerce.payment.config;

import com.bhagya.commerce.payment.provider.MockPaymentProvider;
import com.bhagya.commerce.payment.provider.RazorpayPaymentProvider;
import com.bhagya.commerce.payment.service.PaymentProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class PaymentConfig {

    private final PaymentProperties properties;

    public PaymentConfig(PaymentProperties properties) {
        this.properties = properties;
    }

    @Bean
    @Primary
    public PaymentProvider primaryPaymentProvider(
        MockPaymentProvider mockPaymentProvider,
        RazorpayPaymentProvider razorpayPaymentProvider
    ) {
        if ("razorpay".equalsIgnoreCase(properties.getProvider())) {
            return razorpayPaymentProvider;
        }
        return mockPaymentProvider;
    }
}
