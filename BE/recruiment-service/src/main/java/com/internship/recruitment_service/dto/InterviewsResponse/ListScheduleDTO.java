package com.internship.recruitment_service.dto.InterviewsResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// STUDENT
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListScheduleDTO {

    private String interviewId;
    private String jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private LocalDateTime interviewTime;
    private String status;
}
