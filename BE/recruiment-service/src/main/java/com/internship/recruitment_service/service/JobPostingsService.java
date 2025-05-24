package com.internship.recruitment_service.service;

import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsRequestDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.dto.message.BusinessProfileUpdateMessage;
import com.internship.recruitment_service.model.JobPostings;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public interface JobPostingsService {

    void updateBusinessInfoFromProfile(BusinessProfileUpdateMessage msg);

    JobPostingsRequestDTO sendRequestCreateJobPosting(
            JobPostingsRequestDTO jobPostingsRequestDTO,
            String businessId,
            HttpServletRequest request);

    JobPostingsRequestDTO saveDraftJobPosting(
            JobPostingsRequestDTO jobPostingsRequestDTO,
            String businessId,
            HttpServletRequest request);

    JobPostingsRequestDTO updateJobPosting(JobPostingsRequestDTO jobPostingsRequestDTO);

    JobPostings updateJobPostingStatus(
            String jobId,
            int status,
            String reasonReject
    );

    JobPostings sendJobPostingForApproval(
            String jobId
    );

    JobPostings softDeleteJobPosting(
            String jobId
    );


    PaginatedResponse<JobPostingsResponseDTO> getJobPostingByBusinessId(
            String businessId,
            int offset,
            int limit
    );

    PaginatedResponse<JobPostingsResponseDTO> getJobPostingPublicByBusinessId(
            String businessId,
            int offset,
            int limit
    );

    JobPostingsResponseDTO getDraftJobsByBusinessId(
            String businessId
    );

    List<JobPostingsResponseDTO> getAllJobPostings();

    PaginatedResponse<JobPostingsResponseDTO> getAllPublicJobPostings(int offset, int limit);

    //sang
    PaginatedResponse<JobPostingsResponseDTO> getAllPublicJobPostings(int offset, int limit,
                                                                      String searchkeyword,
                                                                      String location,
                                                                      String company_name,
                                                                      int isurgen,
                                                                      int[] categoryid,
                                                                      boolean sortByexpirationDate);


    JobPostingsResponseDTO getDetailJobById(
            String jobId
    );

    JobPostingsResponseDTO getPublicJobDetailById(
            String jobId
    );


    int countJobPostingsByStatus(int status);

    PaginatedResponse<JobPostingsResponseDTO> getJobPostingsBybusinessidPublic(String businessId, int offset, int limit);

    JobPostings updateJobPostingHide(
            String jobId
    );

    JobPostings updateJobPostingUnHide(
            String jobId
    );

    PaginatedResponse<JobPostingsResponseDTO> getAllJobByStatus(int status, int offset, int limit, String keyword);

    List<JobPostingsResponseDTO> getRandomJobPostings();
}
