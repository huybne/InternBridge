package com.a2m.profileservice.dto.student_profilesDTOs;

import com.a2m.profileservice.dto.StudentCardDTO.StudentCardDTO;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class student_profilesDTOForUpdate {
    private String fullName;
    private String major;
    private Date dateOfBirth;
    private String address;
    private String university;
    private Date academicYearStart;
    private Optional<Date>  academicYearEnd;
    private String phoneNumber;

    private List<String> StudentCardUrlId;
}
