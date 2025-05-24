package com.internship.notificationservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id = UUID.randomUUID().toString();

    private String userId;             // Người nhận thông báo (business hoặc student)
    private String title;              // Tiêu đề thông báo
    private String message;            // Nội dung
    private String type;               // APPLY_JOB, ACCEPTED, REJECTED, INTERVIEW...
    private String redirectUrl;        // Đường dẫn chuyển hướng khi click

    // Optional fields (chỉ áp dụng cho một số loại noti)
    private String jobId;
    private List<String> studentNames;
    private Integer count;

    private Boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
