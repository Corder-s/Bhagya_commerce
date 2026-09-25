package com.bhagya.commerce.notification.channel;

public interface SmsProvider {
    String getProviderName();
    boolean sendSms(String toPhoneNumber, String message);
}
