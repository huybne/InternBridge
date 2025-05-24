package com.internship.recruitment_service.service;

import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

public interface FavoriteJobService {
    public boolean addFavoriteJob(String userId, String jobId);
    public boolean removeFavoriteJob(String userId, String jobId);
    public List<JobPostingsResponseDTO> getAllFavoriteJobs(String userId);
}
