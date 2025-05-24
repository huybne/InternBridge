package com.a2m.profileservice.dto.RequestStudentsDTOs;

import lombok.*;

import java.util.Date;
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestStudentsDTO {
    private String requestId;
    private String studentId;
    private String reason;
    private Date sendTime;
    private String status; // "pending", "approve", "reject"
    private boolean isDeleted;
}
