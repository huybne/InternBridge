package com.internship.recruitment_service.controller;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.TokenInfo;
import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.service.JobCategoriesService;
import com.internship.recruitment_service.util.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/job-categories")
public class JobCategoriesController {

    private final JobCategoriesService jobCategoriesService;
    private final TokenUtil tokenUtil;

    @PostMapping("/{jobId}/assign")
    public ResponseEntity<ApiResponse<?>> assignCategories(
            @PathVariable String jobId,
            @RequestBody List<String> categoryIds,
            HttpServletRequest request
    ) {
//        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
//        tokenUtil.checkAdminRole(tokenInfo);

        jobCategoriesService.assignCategories(jobId, categoryIds);
        ApiResponse<?> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Categories assigned successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{jobId}/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategoriesByJobId(
            @PathVariable String jobId
    ) {
        List<String> categories = jobCategoriesService.getCategoriesByJobId(jobId);
        ApiResponse<List<String>> response = ApiResponse.<List<String>>builder()
                .code(1000)
                .message("Categories retrieved successfully")
                .data(categories)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}/soft-delete")
    public ResponseEntity<ApiResponse<?>> softDeleteCategories(
            @PathVariable String jobId,
            @RequestBody List<String> categoryIds,
            HttpServletRequest request
    ) {
//        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
//        tokenUtil.checkAdminRole(tokenInfo);

        jobCategoriesService.softDeleteCategories(jobId, categoryIds);
        ApiResponse<?> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Categories soft deleted successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{jobId}/recommended-jobs")
    public ResponseEntity<ApiResponse<List<JobPostings>>> getRecommendedJobs(
            @PathVariable String jobId
    ) {
        List<JobPostings> recommendedJobs = jobCategoriesService.getRecommendedJobs(jobId);
        ApiResponse<List<JobPostings>> response = ApiResponse.<List<JobPostings>>builder()
                .code(1000)
                .message("Recommended jobs retrieved successfully")
                .data(recommendedJobs)
                .build();

        return ResponseEntity.ok(response);
    }
}
