package com.a2m.profileservice.controller;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.PageResponseOffset;
import com.a2m.profileservice.dto.request.UpdateRequestStatus;
import com.a2m.profileservice.dto.response.*;
import com.a2m.profileservice.service.StaffAdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff-admin")
@AllArgsConstructor
public class StaffAdminController {
    private final StaffAdminService staffAdminService;

    @GetMapping("/request/students")
    public ResponseEntity<ApiResponse<List<RequestStudentResponse>>> getStudentRequests(
            @RequestParam(required = false) String status) {

        List<RequestStudentResponse> result = (status == null)
                ? staffAdminService.getAllRequestStudentsWithName()
                : staffAdminService.getRequestStudentsByStatus(status);

        return ResponseEntity.ok(
                ApiResponse.<List<RequestStudentResponse>>builder()
                        .message("Get Request Students successfully")
                        .data(result)
                        .build()
        );
    }


    @GetMapping("/request/business")
    public ResponseEntity<ApiResponse<List<RequestBusinessResponse>>> getBusinessRequests(
            @RequestParam(required = false) String status) {

        List<RequestBusinessResponse> result = (status == null)
                ? staffAdminService.getAllRequestBusinessesWithCompanyName()
                : staffAdminService.getRequestBusinessesByStatus(status);

        return ResponseEntity.ok(
                ApiResponse.<List<RequestBusinessResponse>>builder()
                        .message("Get request businesses with company name successfully")
                        .data(result)
                        .build()
        );
    }


    @GetMapping("/request/business/{id}")
    public ResponseEntity<ApiResponse<RequestBusinessDetailResponse>> getBusinessRequestById(@PathVariable String id) {
        RequestBusinessDetailResponse result = staffAdminService.getRequestBusinessesById(id);
        return ResponseEntity.ok(
                ApiResponse.<RequestBusinessDetailResponse>builder()
                        .message("Get request business detail successfully")
                        .data(result)
                        .build()
        );
    }
    @GetMapping("/request/students/{id}")
    public ResponseEntity<ApiResponse<RequestStudentDetailResponse>> getStudentRequestById(@PathVariable String id) {
        RequestStudentDetailResponse result = staffAdminService.getRequestStudentById(id);
        return ResponseEntity.ok(
                ApiResponse.<RequestStudentDetailResponse>builder()
                        .message("Get request student detail successfully")
                        .data(result)
                        .build()
        );
    }

    @PutMapping("/request/business/status")
    public ResponseEntity<ApiResponse<Void>> updateBusinessRequestStatus(
            @RequestBody UpdateRequestStatus request) {

        staffAdminService.updateRequestBusinessStatus(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Update status for business successfully")
                .build());
    }

    @PutMapping("/request/students/status")
    public ResponseEntity<ApiResponse<Void>> updateStudentRequestStatus(
            @RequestBody UpdateRequestStatus request) {

        staffAdminService.updateRequestStudentStatus(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Update status for student  successfully")
                .build());
    }

    //cursor pagination




    @GetMapping("/request/students/offset")
    public ResponseEntity<ApiResponse<PageResponseOffset<RequestStudentResponse>>> getStudentRequestsByOffset(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PageResponseOffset<RequestStudentResponse> result =
                staffAdminService.getRequestStudentsByOffset(status, keyword, page - 1, limit); // page - 1 vì FE truyền từ 1

        return ResponseEntity.ok(
                ApiResponse.<PageResponseOffset<RequestStudentResponse>>builder()
                        .message("Get student requests with offset pagination successfully")
                        .data(result)
                        .build()
        );
    }
    @GetMapping("/request/business/offset")
    public ResponseEntity<ApiResponse<PageResponseOffset<RequestBusinessResponse>>> getBusinessRequestsByOffset(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PageResponseOffset<RequestBusinessResponse> result =
                staffAdminService.getRequestBusinessesByOffset(status, keyword, page - 1, limit); // page - 1 vì FE truyền từ 1

        return ResponseEntity.ok(
                ApiResponse.<PageResponseOffset<RequestBusinessResponse>>builder()
                        .message("Get business requests with offset pagination successfully")
                        .data(result)
                        .build()
        );
    }




    @GetMapping("/pending/total")
    public ResponseEntity<ApiResponse<Integer>> getTotalPending() {
        int total = staffAdminService.getTotalPendingRequest();
        return ResponseEntity.ok(
                ApiResponse.<Integer>builder()
                        .message("Get total pending requests successfully")
                        .data(total)
                        .build()
        );
    }

    @GetMapping("/pending/students")
    public ResponseEntity<ApiResponse<Integer>> getPendingStudents() {
        int count = staffAdminService.getPendingStudentRequest();
        return ResponseEntity.ok(
                ApiResponse.<Integer>builder()
                        .message("Get pending student requests successfully")
                        .data(count)
                        .build()
        );
    }

    @GetMapping("/pending/businesses")
    public ResponseEntity<ApiResponse<Integer>> getPendingBusinesses() {
        int count = staffAdminService.getPendingBusinessRequest();
        return ResponseEntity.ok(
                ApiResponse.<Integer>builder()
                        .message("Get pending business requests successfully")
                        .data(count)
                        .build()
        );
    }

}
