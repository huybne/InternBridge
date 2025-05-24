package com.internship.recruitment_service.dto.InterviewsResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// BUSINESS
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewScheduleDTO {

    private String interviewId;
    private LocalDateTime scheduledAt;
    private String interviewStatus;

    private String applyId;
    private String applyStatus;

    private String studentId;
    private String studentName;
    private String studentAvatarUrl;
    private String studentUniversity;
    private String cvId;

    private String jobId;
    private String jobTitle;
    private String locationCompany;
}
