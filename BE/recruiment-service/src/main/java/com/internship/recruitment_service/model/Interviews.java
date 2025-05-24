package com.internship.recruitment_service.model;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Interviews {

    private String interviewId;
    private String applyId;
    private LocalDateTime scheduledAt;
    private String status;
    private LocalDateTime createdAt;
    private boolean isDeleted;
    private LocalDateTime updatedAt;

}
