package com.internship.recruitment_service.dto.JobPostingsResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingsResponseDTO {

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
    private boolean isDeleted;
    private LocalDateTime updatedAt;
    private String salary;

    private String reasonRejection;

    private List<String> categoryNames;
    private String businessStatus;
}
