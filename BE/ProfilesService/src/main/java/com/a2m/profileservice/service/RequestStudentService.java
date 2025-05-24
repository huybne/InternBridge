package com.a2m.profileservice.service;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.RequestStudentsDTOs.RequestStudentsDTO;
import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTO;

public interface RequestStudentService {
    public ApiResponse<String> SendRequest(String profileId);
    public ApiResponse<RequestStudentsDTO> GetRequestStudent(String student_id);
    public ApiResponse<Boolean> checkApproved(String student_id);
}
