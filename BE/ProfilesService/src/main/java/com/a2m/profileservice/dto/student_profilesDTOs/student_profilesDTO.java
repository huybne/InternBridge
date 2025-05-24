package com.a2m.profileservice.dto.student_profilesDTOs;

import com.a2m.profileservice.dto.StudentCardDTO.StudentCardDTO;
import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class student_profilesDTO {
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

    List<StudentCardDTO> studentCardDTOS;
}
