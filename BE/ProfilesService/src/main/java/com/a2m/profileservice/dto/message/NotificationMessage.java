package com.a2m.profileservice.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessage {
    private String userId;
    private String title;
    private String message;
    private String type;
    private String redirectUrl;
}