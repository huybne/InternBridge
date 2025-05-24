package com.internship.recruitment_service.service.impl;

import com.internship.recruitment_service.client.StudentProfileClient;
import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.BusinessStatusDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.AvatarBusinessDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsRequestDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.dto.message.BusinessProfileUpdateMessage;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import com.internship.recruitment_service.mapper.CategoryMapper;
import com.internship.recruitment_service.mapper.JobCategoriesMapper;
import com.internship.recruitment_service.mapper.JobPostingsMapper;
import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.service.JobPostingsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class JobPostingsServiceImpl implements JobPostingsService {

    private final JobPostingsMapper jobPostingsMapper;
    private final JobCategoriesMapper jobCategoriesMapper;
    private final StudentProfileClient studentProfileClient;
    private final CategoryMapper categoryMapper;

    @Override
    public void updateBusinessInfoFromProfile(BusinessProfileUpdateMessage msg) {
        jobPostingsMapper.updateBusinessInfo(
                msg.getUserId(),
                msg.getCompanyName(),
                msg.getAvatarUrl()
        );
    }
    @Override
    public JobPostingsRequestDTO sendRequestCreateJobPosting(JobPostingsRequestDTO jobPostingsRequestDTO, String businessId, HttpServletRequest request) {
        ApiResponse<AvatarBusinessDTO> response = studentProfileClient.getBussinessProfile(request.getHeader("Authorization"));

        if (response.getCode() != 1000) {
            throw new AppException(ErrorCode.IMAGE_BUSINESS_NOT_FOUND);
        }

        AvatarBusinessDTO avatarBusinessDTO = response.getData();

        // nếu avatar null thi set default
        if (response.getData().getAvatarUrl() == null || response.getData().getAvatarUrl().isEmpty()) {
            avatarBusinessDTO.setAvatarUrl("https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg");
        }

        JobPostings jobPosting = new JobPostings();
        BeanUtils.copyProperties(jobPostingsRequestDTO, jobPosting);

        if (jobPosting.getJobId() == null || jobPosting.getJobId().isEmpty()) {
            jobPosting.setJobId(UUID.randomUUID().toString());
        }

        if (jobPosting.getStatus() == null || jobPosting.getStatus() != 0) {
            jobPosting.setStatus(0);
        }
        return getJobPostings(jobPostingsRequestDTO, businessId, avatarBusinessDTO, jobPosting);
    }

    private JobPostingsRequestDTO getJobPostings(JobPostingsRequestDTO jobPostingsRequestDTO, String businessId, AvatarBusinessDTO avatarBusinessDTO, JobPostings jobPosting) {
        jobPosting.setBusinessId(businessId);
        jobPosting.setAvatarUrl(avatarBusinessDTO.getAvatarUrl());
        jobPosting.setDeleted(false);

        jobPostingsMapper.createJobPosting(jobPosting);

        if (jobPostingsRequestDTO.getCategoryIds() != null && !jobPostingsRequestDTO.getCategoryIds().isEmpty()) {
            jobCategoriesMapper.insertJobCategories(jobPosting.getJobId(), jobPostingsRequestDTO.getCategoryIds());
        }

        return jobPostingsRequestDTO;
    }

    @Override
    public JobPostingsRequestDTO saveDraftJobPosting(JobPostingsRequestDTO jobPostingsRequestDTO, String businessId, HttpServletRequest request) {
        ApiResponse<AvatarBusinessDTO> response = studentProfileClient.getBussinessProfile(request.getHeader("Authorization"));

        if (response.getCode() != 1000) {
            throw new AppException(ErrorCode.IMAGE_BUSINESS_NOT_FOUND);
        }

        AvatarBusinessDTO avatarBusinessDTO = response.getData();

        // nếu avatar null thi set default
        if (response.getData().getAvatarUrl() == null || response.getData().getAvatarUrl().isEmpty()) {
            avatarBusinessDTO.setAvatarUrl("https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg");
        }

        JobPostings jobPosting = new JobPostings();
        BeanUtils.copyProperties(jobPostingsRequestDTO, jobPosting);


        if (jobPosting.getJobId() == null || jobPosting.getJobId().isEmpty()) {
            jobPosting.setJobId(UUID.randomUUID().toString());
        }

        jobPosting.setStatus(-1);
        return getJobPostings(jobPostingsRequestDTO, businessId, avatarBusinessDTO, jobPosting);
    }

    @Override
    public JobPostingsRequestDTO updateJobPosting(JobPostingsRequestDTO jobPostingsRequestDTO) {
        JobPostings existingJobPosting = jobPostingsMapper.getJobPostingEntityById(jobPostingsRequestDTO.getJobId());
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        System.out.println("status: " + existingJobPosting.getStatus());

        if (existingJobPosting.getStatus() == 1) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_EDITED);
        }

        var category = categoryMapper.getCategoriesByJobid(jobPostingsRequestDTO.getJobId());
        List<String> categoryStr = category.stream().map(ct-> ct.getCategoryId()+"").collect(Collectors.toList());

        if (jobPostingsRequestDTO.getCategoryIds() != null && !jobPostingsRequestDTO.getCategoryIds().isEmpty()) {
            jobCategoriesMapper.softDeleteJobCategories(jobPostingsRequestDTO.getJobId(), categoryStr);
            jobCategoriesMapper.insertJobCategories(jobPostingsRequestDTO.getJobId(), jobPostingsRequestDTO.getCategoryIds());
        }

        jobPostingsMapper.updateJobPosting(jobPostingsRequestDTO);
        return jobPostingsRequestDTO;

    }

    @Override
    public JobPostings updateJobPostingStatus(String jobId, int status, String reasonReject) {
        JobPostings existingJobPosting = jobPostingsMapper.getJobPostingEntityById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        existingJobPosting.setStatus(status);
        existingJobPosting.setReasonReject(reasonReject);

        jobPostingsMapper.updateJobPostingStatus(jobId, status, reasonReject);
        return existingJobPosting;
    }

    @Override
    public JobPostings sendJobPostingForApproval(String jobId) {
        JobPostings existingJobPosting = jobPostingsMapper.getJobPostingEntityById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        jobPostingsMapper.sendJobPostingForApproval(jobId);
        return existingJobPosting;
    }

    @Override
    public JobPostings softDeleteJobPosting(String jobId) {
        JobPostings existingJobPosting = jobPostingsMapper.getJobPostingEntityById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        if (existingJobPosting.getStatus() != 1) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_EDITED);
        }

        jobPostingsMapper.softDeleteJob(jobId);
        return existingJobPosting;
    }

    @Override
    public PaginatedResponse<JobPostingsResponseDTO> getJobPostingByBusinessId(String businessId, int offset, int limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("businessId", businessId);
        params.put("offset", offset);
        params.put("limit", limit);

        List<JobPostingsResponseDTO> existingJobPostings = jobPostingsMapper.getJobsByBusinessId(params);
        if (existingJobPostings == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        int totalRecords = jobPostingsMapper.countJobsByBusinessId(businessId);
        int currentPage = offset / limit + 1;
        int totalPages = (int) Math.ceil((double) totalRecords / limit);
        PaginatedResponse<JobPostingsResponseDTO> paginatedResponse = new PaginatedResponse<>();
        paginatedResponse.setData(existingJobPostings);
        paginatedResponse.setPageSize(limit);
        paginatedResponse.setCurrentPage(currentPage);
        paginatedResponse.setTotalRecords(totalRecords);
        paginatedResponse.setTotalPages(totalPages);


        return paginatedResponse;
    }

    @Override
    public PaginatedResponse<JobPostingsResponseDTO> getJobPostingPublicByBusinessId(String businessId, int offset, int limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("businessId", businessId);
        params.put("offset", offset);
        params.put("limit", limit);

        List<JobPostingsResponseDTO> existingJobPostings = jobPostingsMapper.getJobsPublicByBusinessId(params);
        if (existingJobPostings == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        int totalRecords = jobPostingsMapper.countJobPostingsByStatus(1);
        int currentPage = offset / limit + 1;
        int totalPages = (int) Math.ceil((double) totalRecords / limit);
        PaginatedResponse<JobPostingsResponseDTO> paginatedResponse = new PaginatedResponse<>();
        paginatedResponse.setData(existingJobPostings);
        paginatedResponse.setPageSize(limit);
        paginatedResponse.setCurrentPage(currentPage);
        paginatedResponse.setTotalRecords(totalRecords);
        paginatedResponse.setTotalPages(totalPages);

        return paginatedResponse;
    }

    @Override
    public JobPostingsResponseDTO getDraftJobsByBusinessId(String jobId) {
        return null;
    }

    @Override
    public List<JobPostingsResponseDTO> getAllJobPostings() {
        List<JobPostingsResponseDTO> AllJobPosting = jobPostingsMapper.getAllJobPostings();
        if (AllJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }
        return AllJobPosting;
    }

    @Override
    public PaginatedResponse<JobPostingsResponseDTO> getAllPublicJobPostings(int offset, int limit) {
        List<JobPostingsResponseDTO> AllJobPosting = jobPostingsMapper.getPublicJobPostings(offset, limit);
        if (AllJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        int totalRecords = jobPostingsMapper.countJobPostingsByStatus(1);

        int currentPage = offset / limit + 1;
        int totalPages = (int) Math.ceil((double) totalRecords / limit);


        return PaginatedResponse.<JobPostingsResponseDTO>builder()
                .data(AllJobPosting)
                .totalRecords(totalRecords)
                .currentPage(currentPage)
                .pageSize(limit)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public PaginatedResponse<JobPostingsResponseDTO> getAllPublicJobPostings(int offset, int limit, String searchkeyword, String location, String company_name, int isurgen, int[] categoryid, boolean sortByexpirationDate) {
        var listjobdto =  jobPostingsMapper.searchPublicJobPostings(offset, limit, searchkeyword, location, company_name, isurgen, categoryid, sortByexpirationDate);
        var count = jobPostingsMapper.countJobPostings(searchkeyword, location, company_name, isurgen, categoryid);
        PaginatedResponse<JobPostingsResponseDTO> paginatedResponse = new PaginatedResponse<>();
        paginatedResponse.setData(listjobdto);
        paginatedResponse.setPageSize(limit);
        paginatedResponse.setCurrentPage(offset / limit + 1);
        paginatedResponse.setTotalRecords(count);
        int totalPages = (int) Math.ceil((double) count / limit);
        paginatedResponse.setTotalPages(totalPages);

        return  paginatedResponse;
    }

    @Override
    public JobPostingsResponseDTO getDetailJobById(String jobId) {
        JobPostingsResponseDTO existingJobPosting = jobPostingsMapper.getDetailJobById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }
        ApiResponse<BusinessStatusDTO> response = studentProfileClient.getBusinessProfileByIdAny(existingJobPosting.getBusinessId());
        BusinessStatusDTO businessStatusDTO = response.getData();
        existingJobPosting.setBusinessStatus(businessStatusDTO.getStatus());
        return existingJobPosting;
    }

    @Override
    public JobPostingsResponseDTO getPublicJobDetailById(String jobId) {
        JobPostingsResponseDTO existingJobPosting = jobPostingsMapper.getPublicJobDetailById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        if (existingJobPosting.getStatus() != 1) {
            throw new AppException(ErrorCode.JOB_NOT_FOUND);
        }

        ApiResponse<BusinessStatusDTO> response = studentProfileClient.getBusinessProfileByIdAny(existingJobPosting.getBusinessId());
        BusinessStatusDTO businessStatusDTO = response.getData();
        existingJobPosting.setBusinessStatus(businessStatusDTO.getStatus());
        return existingJobPosting;
    }

    @Override
    public int countJobPostingsByStatus(int status) {
        return jobPostingsMapper.countJobPostingsByStatus(status);
    }

    @Override
    public PaginatedResponse<JobPostingsResponseDTO> getJobPostingsBybusinessidPublic(String businessId, int offset, int limit) {
        List<JobPostings> jobPostings = jobPostingsMapper.getJobPostingsByBusinessidPublic(businessId, offset, limit);
        if (jobPostings == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }
        int total = jobPostingsMapper.CountJobPostingsByBusinessidPublic(businessId);
        List<JobPostingsResponseDTO> jobPostingsResponseDTOS = new ArrayList<>();
        jobPostingsResponseDTOS = jobPostings.stream().map(jp -> JobPostingsResponseDTO.builder().jobId(jp.getJobId())
                .businessId(jp.getBusinessId())
                .companyName(jp.getCompanyName())
                .avatarUrl(jp.getAvatarUrl())
                .title(jp.getTitle())
                .description(jp.getDescription())
                .location(jp.getLocation())
                .numberEmployees(jp.getNumberEmployees())
                .status(jp.getStatus())
                .isUrgentRecruitment(jp.isUrgentRecruitment())
                .expirationDate(jp.getExpirationDate())
                .isDeleted(jp.isDeleted())
                .updatedAt(jp.getUpdatedAt())
                .salary(jp.getSalary()).build()).toList();

        for (JobPostingsResponseDTO jobPosting : jobPostingsResponseDTOS) {
            var category = jobCategoriesMapper.getCategoryIdsByJobId(jobPosting.getJobId());
            List<String> categorysName = new ArrayList<>();
            for (String categoryIdStr : category) {
                Integer categoryId = Integer.valueOf(categoryIdStr);

                // Lấy category theo id
                var categoryObj = categoryMapper.getCategoryById(categoryId);

                if (categoryObj != null) {
                    String name = categoryObj.getName();
                    categorysName.add(name);
                }
            }
            jobPosting.setCategoryNames(categorysName);
        }
        PaginatedResponse<JobPostingsResponseDTO> paginatedResponse = new PaginatedResponse<>();
        paginatedResponse.setData(jobPostingsResponseDTOS);
        paginatedResponse.setPageSize(limit);
        paginatedResponse.setCurrentPage(offset + 1);
        paginatedResponse.setTotalRecords(total);
        int totalPage = (int) Math.ceil((double) total / (double) limit);
        paginatedResponse.setTotalPages(totalPage);
        return paginatedResponse;
    }

    @Override
    public JobPostings updateJobPostingHide(String jobId) {
        JobPostings existingJobPosting = jobPostingsMapper.getJobPostingEntityById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        if (existingJobPosting.getStatus() != 1) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_EDITED);
        }

        jobPostingsMapper.updateJobPostingHide(jobId);
        return existingJobPosting;
    }

    @Override
    public JobPostings updateJobPostingUnHide(String jobId) {
        JobPostings existingJobPosting = jobPostingsMapper.getJobPostingEntityById(jobId);
        if (existingJobPosting == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        if (existingJobPosting.getStatus() != 3) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_EDITED);
        }

        jobPostingsMapper.updateJobPostingUnHide(jobId);
        return existingJobPosting;
    }

    @Override
    public PaginatedResponse<JobPostingsResponseDTO> getAllJobByStatus(int status, int offset, int limit, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("status", status);
        params.put("offset", offset);
        params.put("limit", limit);
        params.put("keyword", keyword);
        List<JobPostingsResponseDTO> jobs = jobPostingsMapper.getAllJobByStatus(params);
        int total = jobPostingsMapper.countAllJobByStatus(params);

        int currentPage = offset / limit + 1;
        int totalPages = (int) Math.ceil((double) total / limit);

        return PaginatedResponse.<JobPostingsResponseDTO>builder()
                .data(jobs)
                .totalRecords(total)
                .currentPage(currentPage)
                .pageSize(limit)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public List<JobPostingsResponseDTO> getRandomJobPostings() {
        List<JobPostingsResponseDTO> jobPostings = jobPostingsMapper.getRandomJobPostings();
        if (jobPostings == null) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }
        return jobPostings;
    }

}
