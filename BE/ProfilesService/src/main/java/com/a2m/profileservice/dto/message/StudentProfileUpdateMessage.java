package com.a2m.profileservice.dto.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileUpdateMessage {
    private String userId;
    private String fullName;
    private Date dateOfBirth;
    private String university;
    private String avatarUrl;
}
