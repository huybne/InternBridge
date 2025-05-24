package com.internship.recruitment_service.dto.student_favorite_jobsResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class student_favorite_jobsDTO {
    private String id;
    private String studentId;
    private String jobId;
    private LocalDate createdAt;
    private boolean isDeleted;
}
