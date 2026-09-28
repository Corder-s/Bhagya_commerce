package com.bhagya.commerce.shipping.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class ShippingProviderFactory {

    private final ApplicationContext applicationContext;
    private final String activeProviderName;

    public ShippingProviderFactory(
        ApplicationContext applicationContext,
        @Value("${app.shipping.provider:mock}") String activeProviderName
    ) {
        this.applicationContext = applicationContext;
        this.activeProviderName = activeProviderName;
    }

    public ShippingProvider getProvider() {
        if ("mock".equalsIgnoreCase(activeProviderName) || "sandbox".equalsIgnoreCase(activeProviderName)) {
            return applicationContext.getBean("mockShippingProvider", ShippingProvider.class);
        }
        // If a real shipping provider bean exists (e.g. Delhivery, Shiprocket), return it, otherwise fallback safely to mock
        try {
            return applicationContext.getBean(activeProviderName + "ShippingProvider", ShippingProvider.class);
        } catch (Exception e) {
            return applicationContext.getBean("mockShippingProvider", ShippingProvider.class);
        }
    }
}
