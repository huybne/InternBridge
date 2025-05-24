package com.a2m.profileservice.model;

import lombok.Data;

import java.util.Date;
@Data
public class StudentFavoriteJob {
    private String id;
    private String studentId;
    private String jobId;
    private Date createdAt;
    private boolean isDeleted;
}
