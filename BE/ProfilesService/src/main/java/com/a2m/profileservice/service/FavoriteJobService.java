package com.a2m.profileservice.service;

import com.a2m.profileservice.dto.StudentFavoriteJobDTOs.StudentFavoriteJobDTO;
import com.a2m.profileservice.model.StudentFavoriteJob;

import java.util.List;

public interface FavoriteJobService {
    public boolean addFavoriteJob(String userId, String jobId);
    public boolean removeFavoriteJob(String userId, String jobId);
    public List<StudentFavoriteJobDTO> getAllFavoriteJobs(String userId);
}
