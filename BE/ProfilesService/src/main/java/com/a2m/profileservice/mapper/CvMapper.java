package com.a2m.profileservice.mapper;

import com.a2m.profileservice.dto.ApiResponse;
import org.apache.ibatis.annotations.Mapper;
import com.a2m.profileservice.model.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Mapper
public interface CvMapper {
    List<cv> selectAllCvByStudentId(String studentId, String search);
    int createCv(cv cv);
    int updateCv(cv cv);
    cv selectCvByCvId(String cvid);
    int deleteCvByCvId(String cvid);
}
