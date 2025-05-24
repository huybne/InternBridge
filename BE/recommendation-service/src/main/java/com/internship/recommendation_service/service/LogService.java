package com.internship.recommendation_service.service;


import com.internship.recommendation_service.model.JobViewLog;
import com.internship.recommendation_service.repository.JobViewLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService {
    private final JobViewLogRepository repository;

    public void logJobView(String studentId, String jobId) {
        JobViewLog log = JobViewLog.builder()
                .studentId(studentId)
                .jobId(jobId)
                .viewedAt(LocalDateTime.now())
                .build();
        repository.save(log);
    }

    public List<JobViewLog> getLogsByStudent(String studentId) {
        return repository.findByStudentId(studentId);
    }
}