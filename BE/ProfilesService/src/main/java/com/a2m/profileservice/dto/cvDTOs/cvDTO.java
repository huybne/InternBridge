package com.a2m.profileservice.dto.cvDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class cvDTO {
    private String cvId;
    private String studentId;
    private String title;
    private String cvDetail;
    private Date createdAt;
    private String status; // "draft" hoặc "published"
    private boolean isDeleted;
}
