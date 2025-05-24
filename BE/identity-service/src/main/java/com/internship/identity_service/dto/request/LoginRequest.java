package com.internship.identity_service.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Builder
public class LoginRequest {
    private String email;
    private String password;
}
