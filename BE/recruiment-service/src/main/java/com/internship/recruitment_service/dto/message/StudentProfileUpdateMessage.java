package com.internship.recruitment_service.dto.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileUpdateMessage {
    private String userId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String university;
    private String avatarUrl;
}
