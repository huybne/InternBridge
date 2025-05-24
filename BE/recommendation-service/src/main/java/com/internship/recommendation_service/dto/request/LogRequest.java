package com.internship.recommendation_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LogRequest {
    private String studentId;
    private String jobId;
}