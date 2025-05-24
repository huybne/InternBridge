package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.dto.StudentFavoriteJobDTOs.StudentFavoriteJobDTO;
import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.mapper.FarvouriteJobMapper;
import com.a2m.profileservice.service.FavoriteJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoriteJobServiceImpl implements FavoriteJobService {


    private final FarvouriteJobMapper farvouriteJobMapper;
    @Autowired
    public FavoriteJobServiceImpl(FarvouriteJobMapper farvouriteJobMapper) {
        this.farvouriteJobMapper = farvouriteJobMapper;
    }

    @Override
    public boolean addFavoriteJob(String userId, String jobId) {
        var row = farvouriteJobMapper.addFarvoriteJob(userId, jobId);
        if(row<=0){
            throw new AppException(ErrorCode.ADD_FARVORITE_JOB_FAILED);
        }
        return true;
    }

    @Override
    public boolean removeFavoriteJob(String userId, String jobId) {
        var row = farvouriteJobMapper.removeFarvoriteJob(userId, jobId);
        if(row<=0){
            throw new AppException(ErrorCode.REMOVE_FARVORITE_JOB_FAILED);
        }
        return true;
    }

    @Override
    public List<StudentFavoriteJobDTO> getAllFavoriteJobs(String userId) {
        var model  = farvouriteJobMapper.getFarvoriteJob(userId);
        if(model==null|| model.isEmpty()||model.size()<=0){
            throw new AppException(ErrorCode.NO_FARVORITE_JOB);
        }
        List<StudentFavoriteJobDTO> favoriteJobs = new ArrayList<>();
        favoriteJobs = model.stream()
                .map(fj -> StudentFavoriteJobDTO.builder()
                        .id(fj.getId())
                        .studentId(fj.getStudentId())
                        .jobId(fj.getJobId())
                        .createdAt(fj.getCreatedAt())
                        .isDeleted(fj.isDeleted())
                        .build()).toList();

        return favoriteJobs;
    }
}
