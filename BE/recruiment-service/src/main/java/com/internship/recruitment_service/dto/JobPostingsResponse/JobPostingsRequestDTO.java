package com.internship.recruitment_service.dto.JobPostingsResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class JobPostingsRequestDTO {

    private String jobId;
    private String businessId;
    private String companyName;
    private String avatarUrl;
    private String title;
    private String description;
    private String location;
    private Integer numberEmployees;
    private Integer status; // -1: draft, 0: pending, 1: approved, 2: rejected
    private boolean isUrgentRecruitment;
    private LocalDate expirationDate;
    private String reasonReject;
    private boolean isDeleted;
    private LocalDateTime updatedAt;
    private String salary;

    private List<String> categoryIds;  // category của job
}
