package com.a2m.profileservice.controller;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.BusinessProfileDTOs.BusinessProfilesDTO;
import com.a2m.profileservice.dto.Paging.PageResult;
import com.a2m.profileservice.dto.request.RequestBanUnBan;
import com.a2m.profileservice.dto.response.PageResponse;
import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTO;
import com.a2m.profileservice.mapper.StudentProfilesMapper;
import com.a2m.profileservice.service.BusinessProfileService;
import com.a2m.profileservice.service.StudentProfileService;
import lombok.AllArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@AllArgsConstructor
public class AdminController {

    private final StudentProfileService studentProfileService;
    private final BusinessProfileService businessProfileService;

    @GetMapping("/student/list")
    public ResponseEntity<ApiResponse<PageResult<student_profilesDTO>>> getAllProfiles(@RequestParam(required = false) String search,
                                                                                         @RequestParam(required = false) int isApproved,
                                                                                         @RequestParam(defaultValue = "1") int pageIndex,  // Sử dụng pageIndex (bắt đầu từ 1)
                                                                                         @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (pageIndex - 1) * pageSize;
        var api = studentProfileService.GetStudentProfile(search, isApproved, offset, pageSize);
        return ResponseEntity.ok(api);
    }


    @GetMapping("/business/list")
    public ResponseEntity<ApiResponse<PageResult<BusinessProfilesDTO>>> getAllBusiness(@RequestParam(required = false) String search,
                                                                                         @RequestParam(required = false) int isApproved,
                                                                                         @RequestParam(defaultValue = "1") int pageIndex,  // Sử dụng pageIndex (bắt đầu từ 1)
                                                                                         @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (pageIndex - 1) * pageSize;
        var api = businessProfileService.getAllBusinessProfiles(search, isApproved, offset, pageSize);
        return ResponseEntity.ok(api);
    }


    @GetMapping("/student/detail")
    public ResponseEntity<ApiResponse<student_profilesDTO>> getStudentProfile(@RequestParam String id) {
        var api = studentProfileService.getProfileStudentById(id);
        return ResponseEntity.ok(api);
    }

    @GetMapping("/business/detail")
    public ResponseEntity<ApiResponse<BusinessProfilesDTO>> getBusinessProfile(@RequestParam String id) {
        var api = businessProfileService.getBusinessProfileById_2(id);
        ApiResponse<BusinessProfilesDTO> apiResponse = new ApiResponse<>();
        apiResponse.setData(api);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return ResponseEntity.ok(apiResponse);
    }


    @PutMapping("/student/ban")
    public ResponseEntity<ApiResponse<?>> BanStudent(@RequestBody RequestBanUnBan requestBanUnBan) {
        boolean check = studentProfileService.updateStatusStudent(requestBanUnBan.getProfileId());
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(check ? 200 : 400);
        apiResponse.setMessage("Success");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/business/ban")
    public ResponseEntity<ApiResponse<?>> BanBusiness(@RequestBody RequestBanUnBan requestBanUnBan) {
        boolean check = businessProfileService.updateStatusBusinessProfileById(requestBanUnBan.getProfileId());
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(check ? 200 : 400);
        apiResponse.setMessage("Success");
        return ResponseEntity.ok(apiResponse);
    }
}
