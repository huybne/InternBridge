package com.internship.identity_service.service;

public interface EmailService {
    void sendVerificationEmail(String email, String token);

    void sendResetPasswordEmail(String to, String token);
}
