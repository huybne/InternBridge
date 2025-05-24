package com.internship.recruitment_service.service.impl;

import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import com.internship.recruitment_service.mapper.CategoryMapper;
import com.internship.recruitment_service.mapper.JobCategoriesMapper;
import com.internship.recruitment_service.mapper.JobPostingsMapper;
import com.internship.recruitment_service.mapper.student_favorite_jobsMapper;
import com.internship.recruitment_service.service.FavoriteJobService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class FavoriteJobServiceImpl implements FavoriteJobService {

    private final student_favorite_jobsMapper student_favorite_jobsMapper;
    private final JobPostingsMapper jobPostingsMapper;
    private final JobCategoriesMapper jobCategoriesMapper;
    private final CategoryMapper categoryMapper;

    @Override
    public boolean addFavoriteJob(String userId, String jobId) {
        var check = student_favorite_jobsMapper.checkExistJob(userId, jobId);
        if (check) {
            throw new AppException(ErrorCode.ADD_FARVORITE_JOB_FAILED);
        }
        int r = student_favorite_jobsMapper.addFarvoriteJob(userId, jobId);
        if (r < 1) {
            throw new AppException(ErrorCode.ADD_FARVORITE_JOB_FAILED);
        }
        return true;
    }

    @Override
    public boolean removeFavoriteJob(String userId, String jobId) {
        var row = student_favorite_jobsMapper.removeFarvoriteJob(userId, jobId);
        if (row <= 0) {
            throw new AppException(ErrorCode.REMOVE_FARVORITE_JOB_FAILED);
        }
        return true;
    }

    @Override
    public List<JobPostingsResponseDTO> getAllFavoriteJobs(String userId) {
        var jobPostings = jobPostingsMapper.getJobPostingFarvourite(userId);
        if (jobPostings == null) {
            throw new AppException(ErrorCode.NOT_EXITS_JOB_FARVORITE);
        }
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

        return jobPostingsResponseDTOS;
    }


}
