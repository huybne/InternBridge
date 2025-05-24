package com.a2m.profileservice.dto.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessProfileUpdateMessage {
    private String userId;
    private String companyName;
    private String avatarUrl;
}
