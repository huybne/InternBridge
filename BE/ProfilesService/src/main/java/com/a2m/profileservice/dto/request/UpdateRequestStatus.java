package com.a2m.profileservice.dto.request;

import lombok.Data;

@Data
public class UpdateRequestStatus {
    private String id;
    private String status;
    private String reason;
}
