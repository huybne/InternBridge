package com.internship.recruitment_service.service.impl;

import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import com.internship.recruitment_service.mapper.JobCategoriesMapper;
import com.internship.recruitment_service.mapper.JobPostingsMapper;
import com.internship.recruitment_service.model.JobCategories;
import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.service.JobCategoriesService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobCategoriesServiceImpl implements JobCategoriesService {

    private final JobCategoriesMapper jobCategoriesMapper;

    @Override
    public void assignCategories(String jobId, List<String> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) return;
        jobCategoriesMapper.insertJobCategories(jobId, categoryIds);
    }

    @Override
    public List<String> getCategoriesByJobId(String jobId) {
        return jobCategoriesMapper.getCategoryIdsByJobId(jobId);
    }

    @Override
    public void softDeleteCategories(String jobId, List<String> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) return;
        jobCategoriesMapper.softDeleteJobCategories(jobId, categoryIds);
    }

    @Override
    public List<JobPostings> getRecommendedJobs(String jobId) {
        return jobCategoriesMapper.getRelatedJobsByJobId(jobId);
    }
}
