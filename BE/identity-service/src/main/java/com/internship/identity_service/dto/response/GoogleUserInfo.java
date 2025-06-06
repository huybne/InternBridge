package com.internship.identity_service.dto.response;

import lombok.Data;

@Data
public class GoogleUserInfo {
    private String sub;
    private String name;
    private String given_name;
    private String family_name;
    private String picture;
    private String email;
    private boolean email_verified;
    private String locale;
}
