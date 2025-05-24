package com.a2m.profileservice.mapper;

import com.a2m.profileservice.model.StudentFavoriteJob;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Mapper
public interface FarvouriteJobMapper {
    int addFarvoriteJob(String userId, String jobid);
    int removeFarvoriteJob(String userId, String jobid);
    List<StudentFavoriteJob> getFarvoriteJob(String userId);
}
