package com.internship.recruitment_service.mapper;

import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.model.student_favorite_jobs;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface student_favorite_jobsMapper {
    boolean checkExistJob(String userId, String jobid);

    int addFarvoriteJob(@Param("userId") String userId, @Param("jobid") String jobId);

    int removeFarvoriteJob(String userId, String jobid);
}
