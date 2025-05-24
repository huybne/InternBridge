package com.internship.recruitment_service.mapper;

import com.internship.recruitment_service.model.JobCategories;
import com.internship.recruitment_service.model.JobPostings;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface JobCategoriesMapper {

    int insertJobCategories(@Param("jobId") String jobId, @Param("categoryIds") List<String> categoryIds);

    List<String> getCategoryIdsByJobId(@Param("jobId") String jobId);

    int softDeleteJobCategories(@Param("jobId") String jobId, @Param("categoryIds") List<String> categoryIds);

    List<JobPostings> getRelatedJobsByJobId(@Param("jobId") String jobId);
}

