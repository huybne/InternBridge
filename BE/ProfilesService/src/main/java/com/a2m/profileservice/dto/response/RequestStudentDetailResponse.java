package com.a2m.profileservice.dto.response;

import com.a2m.profileservice.model.BusinessProfiles;
import com.a2m.profileservice.model.RequestBusinesses;
import com.a2m.profileservice.model.RequestStudents;
import com.a2m.profileservice.model.student_profiles;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestStudentDetailResponse {
    private RequestStudents request;
    private student_profiles studentProfiles;
}
