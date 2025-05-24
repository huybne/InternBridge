package com.internship.recruitment_service.dto.ApplyJobsResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileDTO {

    @JsonProperty("fullName")
    private String studentName;

    @JsonProperty("dateOfBirth")
    private LocalDate studentDateOfBirth;

    @JsonProperty("university")
    private String studentUniversity;

    @JsonProperty("avatarUrl")
    private String studentAvatarUrl;
}
