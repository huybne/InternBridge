package com.a2m.profileservice.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestBusinesses {
    private String requestId;
    private String businessId;
    private String reason;
    private LocalDateTime sendTime;
    private String status; // "pending", "approve", "reject"
    private boolean isDeleted;
}
