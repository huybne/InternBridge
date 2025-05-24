package com.internship.recruitment_service.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class JobPostings {

    private String jobId;
    private String businessId;
    private String companyName;
    private String avatarUrl;
    private String title;
    private String description;
    private String location;
    private Integer numberEmployees;
    private Integer status; // -1: draft, 0: pending, 1: approved, 2: rejected, 3: hide
    private boolean isUrgentRecruitment;
    private LocalDate expirationDate;
    private String reasonReject;
    private boolean isDeleted;
    private LocalDateTime updatedAt;
    private String salary;
}
