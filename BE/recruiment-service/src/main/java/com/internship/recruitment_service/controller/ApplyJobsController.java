package com.internship.recruitment_service.controller;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.ApplyJobsResponse.ApplyJobDTO;
import com.internship.recruitment_service.dto.TokenInfo;
import com.internship.recruitment_service.model.ApplyJobs;
import com.internship.recruitment_service.service.ApplyJobsService;
import com.internship.recruitment_service.util.JwtUtil;
import com.internship.recruitment_service.util.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/apply-jobs")
public class ApplyJobsController {

    private final ApplyJobsService applyJobsService;
    private final TokenUtil tokenUtil;

    @PostMapping("/send-apply-job")
    public ResponseEntity<ApiResponse<ApplyJobs>> sendApplyJob(
            HttpServletRequest request,
            @RequestBody ApplyJobs applyJobs
    ){
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkStudentRole(tokenInfo);

            String studentId = tokenInfo.getUserId();
            applyJobs.setStudentId(studentId);
            ApplyJobs createdApplyJob = applyJobsService.sendApplyJob(applyJobs, request);
            ApiResponse<ApplyJobs> response = ApiResponse.<ApplyJobs>builder()
                    .code(1000)
                    .message("Send apply job successfully")
                    .data(createdApplyJob)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<ApplyJobs> response = ApiResponse.<ApplyJobs>builder()
                    .code(1001)
                    .message("Failed to send apply job: " + e.getMessage())
                    .build();
            return ResponseEntity.status(500).body(response);
        }
    }
    // business
    @GetMapping("/view-list-apply-job/{jobId}")
    public ResponseEntity<?> viewListApplyJob(
            HttpServletRequest request,
            @PathVariable String jobId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") int limit
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        LocalDateTime cursorDateTime = null;
        if (cursor != null && !cursor.isEmpty()) {
            cursorDateTime = LocalDateTime.parse(cursor);
        }

        String nextCursor = null;

        List<ApplyJobs> listApplyJob = applyJobsService.getApplyJobsByJobId(jobId, cursorDateTime, limit);

        if (listApplyJob.size() == limit) {
            nextCursor = listApplyJob.get(listApplyJob.size() - 1).getAppliedAt().toString();
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("listApplyJob", listApplyJob);
        responseData.put("nextCursor", nextCursor);

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .code(1000)
                .message("Get list apply job successfully")
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/view-detail-apply-job/{applyId}")
    public ResponseEntity<ApiResponse<ApplyJobs>> viewDetailApplyJob(
            @PathVariable String applyId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        ApplyJobs applyJob = applyJobsService.getDetailApplyJobById(applyId);
        ApiResponse<ApplyJobs> response = ApiResponse.<ApplyJobs>builder()
                .code(1000)
                .message("Get detail apply job successfully")
                .data(applyJob)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applyId}/accepted")
    public ResponseEntity<ApiResponse<ApplyJobs>> acceptApplyJob(
            @PathVariable String applyId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        ApplyJobs updatedApplyJob = applyJobsService.updateAcceptOrRejectApplyJob(applyId, "accepted");
        ApiResponse<ApplyJobs> response = ApiResponse.<ApplyJobs>builder()
                .code(1000)
                .message("Accept apply job successfully")
                .data(updatedApplyJob)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applyId}/rejected")
    public ResponseEntity<ApiResponse<ApplyJobs>> rejectApplyJob(
            @PathVariable String applyId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        ApplyJobs updatedApplyJob = applyJobsService.updateAcceptOrRejectApplyJob(applyId, "rejected");
        ApiResponse<ApplyJobs> response = ApiResponse.<ApplyJobs>builder()
                .code(1000)
                .message("Reject apply job successfully")
                .data(updatedApplyJob)
                .build();

        return ResponseEntity.ok(response);
    }

    // student
    @GetMapping("/my-apply-jobs")
    public ResponseEntity<?> getMyApplyJobs(
            HttpServletRequest request,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor,
            @RequestParam(defaultValue = "1") int limit
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkStudentRole(tokenInfo);

        String authHeader = request.getHeader("Authorization");
        List<ApplyJobDTO> myApplyJobs = applyJobsService.getAllApplyJobsByStudentId(request,status, cursor, limit);

        LocalDateTime nextCursor = null;
        if (myApplyJobs.size() == limit) {
            nextCursor = myApplyJobs.get(myApplyJobs.size() - 1).getApplyDate();
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("myApplyJobs", myApplyJobs);
        responseData.put("nextCursor", nextCursor);

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .code(1000)
                .message("Get my apply jobs successfully")
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applyId}/update-cv/{cvId}")
    public ResponseEntity<ApiResponse<ApplyJobs>> updateCvId(
            @PathVariable String applyId,
            @PathVariable String cvId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkStudentRole(tokenInfo);

        ApplyJobs updatedApplyJob = applyJobsService.updateCvId(applyId, cvId);
        ApiResponse<ApplyJobs> response = ApiResponse.<ApplyJobs>builder()
                .code(1000)
                .message("Update CV ID successfully")
                .data(updatedApplyJob)
                .build();

        return ResponseEntity.ok(response);
    }
}
