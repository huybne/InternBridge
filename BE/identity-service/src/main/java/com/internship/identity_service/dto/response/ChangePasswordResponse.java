package com.internship.identity_service.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
public class ChangePasswordResponse {
    private boolean success;
    private String newAccessToken;
}
