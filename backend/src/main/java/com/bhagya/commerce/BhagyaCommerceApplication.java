package com.bhagya.commerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Bhagya Commerce — Enterprise Spring Boot Backend Application (Step 11)
 *
 * Modular Monolith architecture serving public discovery, customer shopping,
 * merchant management, order tracking, and controlled AI assistance.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class BhagyaCommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BhagyaCommerceApplication.class, args);
    }
}
