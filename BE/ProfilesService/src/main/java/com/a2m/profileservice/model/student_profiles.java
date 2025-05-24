package com.a2m.profileservice.model;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class student_profiles {
    private String profileId;
    private String fullName;
    private String major;
    private Date dateOfBirth;
    private String address;
    private String university;
    private String avatarUrl;
    private Date academicYearStart;
    private Date academicYearEnd;
    private String phoneNumber;
    private boolean isApproved;
    private String status;
    private boolean isDeleted;
    private Date createdAt;
    private Date updatedAt;
}
