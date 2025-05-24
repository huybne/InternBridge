package com.internship.recruitment_service.controller;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.InterviewsResponse.InterviewScheduleDTO;
import com.internship.recruitment_service.dto.InterviewsResponse.ListScheduleDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.dto.TokenInfo;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.model.Interviews;
import com.internship.recruitment_service.service.InterviewsService;
import com.internship.recruitment_service.util.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/interviews")
public class InterviewsController {

    private final InterviewsService interviewsService;
    private final TokenUtil tokenUtil;

    // business
    @PostMapping("/setup-scheduled-interview")
    public ResponseEntity<ApiResponse<Interviews>> setupScheduledInterview(
            @RequestBody Interviews interviews,
            HttpServletRequest request
    ) {
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkBusinessRole(tokenInfo);

            interviewsService.setupScheduledInterview(interviews);

            ApiResponse<Interviews> response = ApiResponse.<Interviews>builder()
                    .code(1000)
                    .message("Setup scheduled interview successfully")
                    .data(interviews)
                    .build();
            return ResponseEntity.ok(response);
        } catch (AppException e) {
            ApiResponse<Interviews> response = ApiResponse.<Interviews>builder()
                    .code(1001)
                    .message("Failed to setup scheduled interview: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/get-interviews-schedules/{jobId}")
    public ResponseEntity<ApiResponse<PaginatedResponse<InterviewScheduleDTO>>> getAllInterviewsSchedules(
            @PathVariable String jobId,
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkBusinessRole(tokenInfo);

            PaginatedResponse<InterviewScheduleDTO> paginatedResponse = interviewsService.getAllInterviewsSchedules(jobId, offset, limit);
            ApiResponse<PaginatedResponse<InterviewScheduleDTO>> response = ApiResponse.<PaginatedResponse<InterviewScheduleDTO>>builder()
                    .code(1000)
                    .message("Get interview schedules successfully")
                    .data(paginatedResponse)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<PaginatedResponse<InterviewScheduleDTO>> response = ApiResponse.<PaginatedResponse<InterviewScheduleDTO>>builder()
                    .code(1001)
                    .message("Failed to get interview schedules: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/get-interviews-schedules/business")
    public ResponseEntity<ApiResponse<List<InterviewScheduleDTO>>> getAllInterviewsSchedulesByBusinessId(
            HttpServletRequest request
    ) {
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkBusinessRole(tokenInfo);

            String businessId = tokenInfo.getUserId();
            List<InterviewScheduleDTO> interviewSchedules = interviewsService.getAllInterviewsSchedulesByBusinessId(businessId);

            ApiResponse<List<InterviewScheduleDTO>> response = ApiResponse.<List<InterviewScheduleDTO>>builder()
                    .code(1000)
                    .message("Get interview schedules successfully")
                    .data(interviewSchedules)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<InterviewScheduleDTO>> response = ApiResponse.<List<InterviewScheduleDTO>>builder()
                    .code(1001)
                    .message("Failed to get interview schedules: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }

    // student
    @GetMapping("/get-interviews-schedules/me")
    public ResponseEntity<ApiResponse<PaginatedResponse<ListScheduleDTO>>> getAllInterviewsSchedulesByStudentId(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkStudentRole(tokenInfo);

            String studentId = tokenInfo.getUserId();
            PaginatedResponse<ListScheduleDTO> interviewSchedules = interviewsService.getAllInterviewsSchedulesByStudentId(studentId, offset, limit);

            ApiResponse<PaginatedResponse<ListScheduleDTO>> response = ApiResponse.<PaginatedResponse<ListScheduleDTO>>builder()
                    .code(1000)
                    .message("Get interview schedules successfully")
                    .data(interviewSchedules)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<PaginatedResponse<ListScheduleDTO>> response = ApiResponse.<PaginatedResponse<ListScheduleDTO>>builder()
                    .code(1001)
                    .message("Failed to get interview schedules: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }

    @PatchMapping("/update-interview-status/{interviewId}")
    public ResponseEntity<ApiResponse<Integer>> updateInterviewStatus(
            @PathVariable String interviewId,
            @RequestBody Map<String, String> requestBody,
            HttpServletRequest request
    ) {
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkStudentRole(tokenInfo);

            String status = requestBody.get("status");

            int updatedRows = interviewsService.updateInterviewStatus(interviewId, status);

            ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                    .code(1000)
                    .message("Update interview status successfully")
                    .data(updatedRows)
                    .build();

            return ResponseEntity.ok(response);
        } catch (AppException e) {
            ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                    .code(1001)
                    .message("Failed to update interview status: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }
}
