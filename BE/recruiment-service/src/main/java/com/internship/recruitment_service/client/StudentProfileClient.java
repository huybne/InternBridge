package com.internship.recruitment_service.client;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.ApplyJobsResponse.StudentProfileDTO;
import com.internship.recruitment_service.dto.BusinessStatusDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.AvatarBusinessDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "profile-service", url = "${profile-service.url}")
public interface StudentProfileClient {

    @GetMapping("/api/student_profiles/checkExits")

    ApiResponse<?> checkExits(@RequestParam("userId") String userId);


    @GetMapping("/api/student_profiles/viewprofile")
    ApiResponse<StudentProfileDTO> getStudentProfiles(@RequestHeader("Authorization") String token);

    @GetMapping("api/v1/business/me")
    ApiResponse<AvatarBusinessDTO> getBussinessProfile(@RequestHeader("Authorization") String token);

    @GetMapping("/api/v1/business/status/{profileId}")
    ApiResponse<BusinessStatusDTO> getBusinessProfileByIdAny(@PathVariable("profileId") String businessId);

}
