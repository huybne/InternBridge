package com.internship.recruitment_service.model;

import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class student_favorite_jobs {
    private String id;
    private String studentId;
    private String jobId;
    private LocalDate createdAt;
    private boolean isDeleted;
}
