package com.internship.recommendation_service.repository;


import com.internship.recommendation_service.model.JobViewLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JobViewLogRepository extends MongoRepository<JobViewLog, String> {
    List<JobViewLog> findByStudentId(String studentId);
}