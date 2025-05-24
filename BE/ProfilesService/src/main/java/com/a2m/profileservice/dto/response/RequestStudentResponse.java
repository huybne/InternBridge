package com.a2m.profileservice.dto.response;


import com.a2m.profileservice.model.RequestStudents;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestStudentResponse {
    private RequestStudents requestStudents;
    private String studentName;
    private String uni;
    private String avatar;
}
