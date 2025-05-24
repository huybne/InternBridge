package com.internship.recruitment_service.service;

import com.internship.recruitment_service.model.JobPostings;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface JobCategoriesService {
    void assignCategories(String jobId, List<String> categoryIds);
    List<String> getCategoriesByJobId(String jobId);
    void softDeleteCategories(String jobId, List<String> categoryIds);
    List<JobPostings> getRecommendedJobs(String jobId);
}
