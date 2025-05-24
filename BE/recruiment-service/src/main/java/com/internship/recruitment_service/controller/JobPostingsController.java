package com.internship.recruitment_service.controller;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.CategoryResponse.CategoryResponse;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsRequestDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.ReasonRejectDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.dto.TokenInfo;
import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.service.CategoryService;
import com.internship.recruitment_service.service.JobPostingsService;
import com.internship.recruitment_service.util.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/job-postings")
public class JobPostingsController {

    private final JobPostingsService jobPostingsService;
    private final CategoryService categoryService;
    private final TokenUtil tokenUtil;

    @PostMapping("/send-request-job-posting")
    public ResponseEntity<ApiResponse<JobPostingsRequestDTO>> sendRequestCreateJobPosting (
            @RequestBody JobPostingsRequestDTO jobPostingsRequestDTO,
            HttpServletRequest request
    ) {
        try {
            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
            tokenUtil.checkBusinessRole(tokenInfo);

            String businessId = tokenInfo.getUserId();

            jobPostingsService.sendRequestCreateJobPosting(jobPostingsRequestDTO, businessId, request);
            ApiResponse<JobPostingsRequestDTO> response = ApiResponse.<JobPostingsRequestDTO>builder()
                    .code(1000)
                    .message("Create job posting successfully")
                    .data(jobPostingsRequestDTO)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<JobPostingsRequestDTO> response = ApiResponse.<JobPostingsRequestDTO>builder()
                    .code(1001)
                    .message("Failed to create job posting: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }

    }

    @PostMapping("/save-draft-job-posting")
    public ResponseEntity<ApiResponse<JobPostingsRequestDTO>> saveDraftJobPosting (
            @RequestBody JobPostingsRequestDTO jobPostingsRequestDTO,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        String businessId = tokenInfo.getUserId();
        jobPostingsService.saveDraftJobPosting(jobPostingsRequestDTO, businessId, request);
        ApiResponse<JobPostingsRequestDTO> response = ApiResponse.<JobPostingsRequestDTO>builder()
                .code(1000)
                .message("Save draft job posting successfully")
                .data(jobPostingsRequestDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-job-posting")
    public ResponseEntity<ApiResponse<JobPostingsRequestDTO>> updateJobPosting(
            @RequestBody JobPostingsRequestDTO jobPostingsRequestDTO,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        jobPostingsService.updateJobPosting(jobPostingsRequestDTO);
        ApiResponse<JobPostingsRequestDTO> response = ApiResponse.<JobPostingsRequestDTO>builder()
                .code(1000)
                .message("Update job posting successfully")
                .data(jobPostingsRequestDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/send-draft/{jobId}")
    public ResponseEntity<ApiResponse<JobPostings>> sendDraftJobPosting(
            @PathVariable String jobId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        JobPostings jobPosting = jobPostingsService.sendJobPostingForApproval(jobId);
        ApiResponse<JobPostings> response = ApiResponse.<JobPostings>builder()
                .code(1000)
                .message("Send draft job posting successfully")
                .data(jobPosting)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}/accept")
    public ResponseEntity<ApiResponse<JobPostings>> acceptJobPosting(
            @PathVariable String jobId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkAdminRole(tokenInfo);

        JobPostings jobPosting = jobPostingsService.updateJobPostingStatus(jobId, 1, null);
        ApiResponse<JobPostings> response = ApiResponse.<JobPostings>builder()
                .code(1000)
                .message("Accept job posting successfully")
                .data(jobPosting)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}/reject")
    public ResponseEntity<ApiResponse<JobPostings>> rejectJobPosting(
            @PathVariable String jobId,
            @RequestBody ReasonRejectDTO reasonReject,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkAdminRole(tokenInfo);

        JobPostings jobPosting = jobPostingsService.updateJobPostingStatus(jobId, 2, reasonReject.getReasonReject());
        ApiResponse<JobPostings> response = ApiResponse.<JobPostings>builder()
                .code(1000)
                .message("Reject job posting successfully")
                .data(jobPosting)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}/banned")
    public ResponseEntity<ApiResponse<JobPostings>> bannedJobPosting(
            @PathVariable String jobId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkAdminRole(tokenInfo);

        JobPostings jobPosting = jobPostingsService.softDeleteJobPosting(jobId);
        ApiResponse<JobPostings> response = ApiResponse.<JobPostings>builder()
                .code(1000)
                .message("Banned job posting successfully")
                .data(jobPosting)
                .build();

        return ResponseEntity.ok(response);
    }

    // STAFF_ADMIN
    @GetMapping("/view-all-job-postings")
    public ResponseEntity<ApiResponse<List<JobPostingsResponseDTO>>> getAllJobPostings() {

        List<JobPostingsResponseDTO> listJob = jobPostingsService.getAllJobPostings();
        ApiResponse<List<JobPostingsResponseDTO>> response = ApiResponse.<List<JobPostingsResponseDTO>>builder()
                .code(1000)
                .message("Get all job postings successfully")
                .data(listJob)
                .build();

        return ResponseEntity.ok(response);
    }

    // USER
    @GetMapping("/view-all-public-job")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<ApiResponse<PaginatedResponse<JobPostingsResponseDTO>>> getAllPublicJobPostings(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "110") int limit,
            @RequestParam(defaultValue = "") String searchkeyword,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(defaultValue = "") String company_name,
            @RequestParam(defaultValue = "-1") int isurgen,
            @RequestParam(required = false) int [] categoryid,
            @RequestParam(required = false) boolean sortByexpirationDate
    ) {

        //PaginatedResponse<JobPostingsResponseDTO> listJob = jobPostingsService.getAllPublicJobPostings(offset, limit);
        PaginatedResponse<JobPostingsResponseDTO> listJob = jobPostingsService.getAllPublicJobPostings(offset, limit, searchkeyword, location, company_name, isurgen, categoryid, sortByexpirationDate);
        ApiResponse<PaginatedResponse<JobPostingsResponseDTO>> response = ApiResponse.<PaginatedResponse<JobPostingsResponseDTO>>builder()
                .code(1000)
                .message("Get all public job postings successfully")
                .data(listJob)
                .build();

        return ResponseEntity.ok(response);
    }


    // get all job postings w all status - business
    @GetMapping("/view-list-job-created")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<ApiResponse<PaginatedResponse<JobPostingsResponseDTO>>> viewListJobCreated(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit
    ){

        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        String businessId = tokenInfo.getUserId();
        PaginatedResponse<JobPostingsResponseDTO> listJob = jobPostingsService.getJobPostingByBusinessId(businessId, offset, limit);
        ApiResponse<PaginatedResponse<JobPostingsResponseDTO>> response = ApiResponse.<PaginatedResponse<JobPostingsResponseDTO>>builder()
                .code(1000)
                .message("Get list job successfully")
                .data(listJob)
                .build();

        return ResponseEntity.ok(response);
    }

    // get all public job - business
    @GetMapping("/view-list-job-public")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<ApiResponse<PaginatedResponse<JobPostingsResponseDTO>>> viewListJobPublic(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "2") int limit
    ){

        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        String businessId = tokenInfo.getUserId();
        PaginatedResponse<JobPostingsResponseDTO> listJob = jobPostingsService.getJobPostingPublicByBusinessId(businessId, offset, limit);
        ApiResponse<PaginatedResponse<JobPostingsResponseDTO>> response = ApiResponse.<PaginatedResponse<JobPostingsResponseDTO>>builder()
                .code(1000)
                .message("Get list job successfully")
                .data(listJob)
                .build();

        return ResponseEntity.ok(response);
    }

    // STAFF_ADMIN
    @GetMapping("/detail-job/{jobId}")
    public ResponseEntity<ApiResponse<JobPostingsResponseDTO>> getDetailJobById(
            @PathVariable String jobId,
            HttpServletRequest request
    ){
        try {
//            TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
//            tokenUtil.checkBusinessRole(tokenInfo);

            JobPostingsResponseDTO detailJob = jobPostingsService.getDetailJobById(jobId);
            ApiResponse<JobPostingsResponseDTO> response = ApiResponse.<JobPostingsResponseDTO>builder()
                    .code(1000)
                    .message("Get detail job successfully")
                    .data(detailJob)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<JobPostingsResponseDTO> response = ApiResponse.<JobPostingsResponseDTO>builder()
                    .code(1001)
                    .message("Failed to get detail job posting: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }

    // USER
    @GetMapping("/view-public-job/{jobId}")
    public ResponseEntity<ApiResponse<JobPostingsResponseDTO>> getPublicJobDetailById(
            @PathVariable String jobId
    ){
        try {

            JobPostingsResponseDTO detailJob = jobPostingsService.getPublicJobDetailById(jobId);
            ApiResponse<JobPostingsResponseDTO> response = ApiResponse.<JobPostingsResponseDTO>builder()
                    .code(1000)
                    .message("Get detail job successfully")
                    .data(detailJob)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<JobPostingsResponseDTO> response = ApiResponse.<JobPostingsResponseDTO>builder()
                    .code(1001)
                    .message("Failed to get detail job posting: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }
    @GetMapping("/count/status")
    public ResponseEntity<ApiResponse<Integer>> countJobPostingsByStatus(
            @RequestParam int status,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkAdminRole(tokenInfo); // CHẶN nếu không phải ADMIN hoặc STAFF_ADMIN

        int count = jobPostingsService.countJobPostingsByStatus(status);
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(1000)
                .message("Count job postings by status successfully")
                .data(count)
                .build();

        return ResponseEntity.ok(response);
    }
    //sang
    @GetMapping("/getalljobbybusinessid/{id}")
    public ResponseEntity<?> getJobPostingsByBusinessId(@PathVariable String id,@RequestParam(defaultValue = "1") int pageIndex,  // Sử dụng pageIndex (bắt đầu từ 1)
                                                        @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (pageIndex - 1) * pageSize;
        var api = jobPostingsService.getJobPostingsBybusinessidPublic(id, offset, pageSize);
        ApiResponse<PaginatedResponse<JobPostingsResponseDTO>> response = new ApiResponse<>();
        response.setCode(200);
        response.setData(api);
        response.setMessage("Get job postings successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/hide-job-posting/{jobId}")
    public ResponseEntity<ApiResponse<JobPostings>> updateJobPostingHide(
            @PathVariable String jobId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        JobPostings jobPosting = jobPostingsService.updateJobPostingHide(jobId);
        ApiResponse<JobPostings> response = ApiResponse.<JobPostings>builder()
                .code(1000)
                .message("Hide job posting successfully")
                .data(jobPosting)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/unhide-job-posting/{jobId}")
    public ResponseEntity<ApiResponse<JobPostings>> updateJobPostingUnHide(
            @PathVariable String jobId,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkBusinessRole(tokenInfo);

        JobPostings jobPosting = jobPostingsService.updateJobPostingUnHide(jobId);
        ApiResponse<JobPostings> response = ApiResponse.<JobPostings>builder()
                .code(1000)
                .message("Unhide job posting successfully")
                .data(jobPosting)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<ApiResponse<PaginatedResponse<JobPostingsResponseDTO>>> getAllJobPostingsByStatus(
            @RequestParam int status,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String keyword,
            HttpServletRequest request
    ) {
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        tokenUtil.checkAdminRole(tokenInfo); // Chặn nếu không phải ADMIN hoặc STAFF_ADMIN

        PaginatedResponse<JobPostingsResponseDTO> result =
                jobPostingsService.getAllJobByStatus(status, offset, limit,keyword);

        ApiResponse<PaginatedResponse<JobPostingsResponseDTO>> response = ApiResponse.<PaginatedResponse<JobPostingsResponseDTO>>builder()
                .code(1000)
                .message("Get job postings by status successfully")
                .data(result)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-random-jobs")
    public ResponseEntity<ApiResponse<List<JobPostingsResponseDTO>>> getRandomJobs(
    ) {
        List<JobPostingsResponseDTO> listJob = jobPostingsService.getRandomJobPostings();
        ApiResponse<List<JobPostingsResponseDTO>> response = ApiResponse.<List<JobPostingsResponseDTO>>builder()
                .code(1000)
                .message("Get random jobs successfully")
                .data(listJob)
                .build();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/getcategory/{id}")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategoryJobPostings(@PathVariable String id) {
        var data = categoryService.getCategoriesByJobid(id);
        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Get category job postings successfully");
        response.setData(data);
        return ResponseEntity.ok(response);
    }



}
