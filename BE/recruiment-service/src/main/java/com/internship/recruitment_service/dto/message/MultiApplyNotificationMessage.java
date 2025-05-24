package com.internship.recruitment_service.dto.message;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MultiApplyNotificationMessage {
    private String userId;
    private String jobId;
    private String title;
    private String message;
    private String type;
    private String redirectUrl;
    private List<String> studentNames;
    private Integer count;
}
