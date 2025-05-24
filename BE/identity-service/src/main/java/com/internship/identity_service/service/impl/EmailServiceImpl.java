package com.internship.identity_service.service.impl;

import com.internship.identity_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;
    @Value("${app.mail-from}")
    private String fromEmail;
    @Override
    public void sendVerificationEmail(String email, String token) {
        String verifyUrl = baseUrl + "/api/v1/auth/verify?token=" + token;
        String subject = "Xác minh tài khoản Internship";
        String body = "Nhấn vào liên kết sau để xác minh tài khoản của bạn:\n\n" + verifyUrl;

        sendEmail(email, subject, body);
    }

    @Override
    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        String subject = "Đặt lại mật khẩu";
        String content = """
        
        Bạn vừa yêu cầu đặt lại mật khẩu.
        Nhấn vào liên kết bên dưới để đặt lại:

        %s

        Liên kết sẽ hết hạn sau 5 phút.
        """.formatted(resetLink);

        sendEmail(toEmail, subject, content);
    }


    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
