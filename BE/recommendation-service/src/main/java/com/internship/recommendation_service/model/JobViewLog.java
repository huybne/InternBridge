package com.internship.recommendation_service.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "job_view_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobViewLog {
    @Id
    private String id;
    private String studentId;
    private String jobId;
    private LocalDateTime viewedAt;
}