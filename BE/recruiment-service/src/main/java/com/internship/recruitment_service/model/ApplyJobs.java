package com.internship.recruitment_service.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ApplyJobs {
    private String applyId;
    private String jobId;
    private String studentId;
    private String cvId;
    private String studentName;
    private LocalDate studentDateOfBirth;
    private String studentUniversity;
    private String studentAvatarUrl;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime viewedAt;
    private boolean isDeleted;
    private LocalDateTime updatedAt;
    private String jobTitle;

}
