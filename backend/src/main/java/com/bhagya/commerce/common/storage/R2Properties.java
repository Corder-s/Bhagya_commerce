package com.bhagya.commerce.common.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "bhagya.r2")
public class R2Properties {
    private String accountId = "sample-r2-account-id";
    private String accessKeyId = "sample-r2-access-key";
    private String secretAccessKey = "sample-r2-secret-key";
    private String bucketName = "bhagya-commerce-media";
    private String publicBaseUrl = "https://media.bhagya.commerce";

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getAccessKeyId() { return accessKeyId; }
    public void setAccessKeyId(String accessKeyId) { this.accessKeyId = accessKeyId; }

    public String getSecretAccessKey() { return secretAccessKey; }
    public void setSecretAccessKey(String secretAccessKey) { this.secretAccessKey = secretAccessKey; }

    public String getBucketName() { return bucketName; }
    public void setBucketName(String bucketName) { this.bucketName = bucketName; }

    public String getPublicBaseUrl() { return publicBaseUrl; }
    public void setPublicBaseUrl(String publicBaseUrl) { this.publicBaseUrl = publicBaseUrl; }

    public String getEndpointUrl() {
        return "https://" + accountId + ".r2.cloudflarestorage.com";
    }
}
