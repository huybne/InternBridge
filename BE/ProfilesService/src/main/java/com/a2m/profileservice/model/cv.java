package com.a2m.profileservice.model;

import lombok.*;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class cv {
    private String cvId;
    private String studentId;
    private String title;
    private String cvDetail;
    private Date createdAt;
    private String status; // "draft" hoặc "published"
    private boolean isDeleted;
}
