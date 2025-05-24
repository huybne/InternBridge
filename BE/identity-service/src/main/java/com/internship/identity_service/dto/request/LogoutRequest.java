package com.internship.identity_service.dto.request;

import lombok.Data;

@Data
public class LogoutRequest {
    private String accessToken;
}