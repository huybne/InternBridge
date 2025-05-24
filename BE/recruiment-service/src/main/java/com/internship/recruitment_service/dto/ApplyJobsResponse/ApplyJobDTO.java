package com.internship.recruitment_service.dto.ApplyJobsResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyJobDTO {

    private String applyId;
    private String jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private String salary;
    private String applyStatus;
    private LocalDateTime applyDate;
    private String jobStatus;
    private String cvId;
}
