package com.internship.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    // ⚠️ Optional - dùng riêng cho loại MULTI_APPLY
    private String jobId;
    private String applyId;
    private List<String> studentNames;
    private Integer count;
}
