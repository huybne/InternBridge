package com.internship.identity_service.dto.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
}
