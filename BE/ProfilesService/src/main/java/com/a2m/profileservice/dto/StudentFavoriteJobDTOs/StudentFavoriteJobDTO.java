package com.a2m.profileservice.dto.StudentFavoriteJobDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentFavoriteJobDTO {
    private String id;
    private String studentId;
    private String jobId;
    private Date createdAt;
    private boolean isDeleted;
}
