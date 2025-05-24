package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.cvDTOs.cvDTO;
import com.a2m.profileservice.dto.cvDTOs.cvDTOForCreate;
import com.a2m.profileservice.dto.cvDTOs.cvDTOForUpdate;
import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.mapper.CvMapper;
import com.a2m.profileservice.service.CVSerrvice;
import com.a2m.profileservice.model.cv;
import lombok.Setter;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CvServiceImpl implements CVSerrvice {

    private final CvMapper cvMapper;
    @Autowired
    public CvServiceImpl(CvMapper cvMapper) {
        this.cvMapper = cvMapper;
    }

    @Override
    public ApiResponse<List<cvDTO>> getCvByUserID(String id, String search) {
        List<com.a2m.profileservice.model.cv> cvs = cvMapper.selectAllCvByStudentId(id, search);
        if(cvs == null || cvs.size() <= 0) {
            throw new AppException(ErrorCode.CV_NOT_FOUND);
        }
        ApiResponse<List<cvDTO>> apiResponse = new ApiResponse<>();
        List<cvDTO> cvDTOList = cvs.stream().map(cv-> cvDTO.builder().cvId(cv.getCvId()).title(cv.getTitle()).studentId(cv.getStudentId())
                .cvDetail(cv.getCvDetail()).createdAt(cv.getCreatedAt()).status(cv.getStatus()).isDeleted(false)
                .build()).collect(Collectors.toList());
        apiResponse.setData(cvDTOList);
        apiResponse.setCode(200);
        apiResponse.setMessage("success getCvByUserID");
        return apiResponse;
    }

    @Override
    public ApiResponse<String> CreateCv(cvDTOForCreate cvDTO, String id) {
        com.a2m.profileservice.model.cv cv = new com.a2m.profileservice.model.cv();
        cv.setTitle(cvDTO.getTitle());
        cv.setCvDetail(cvDTO.getCvDetail());
        cv.setStudentId(id);
        int row = cvMapper.createCv(cv);

        if(row <= 0) {
            throw new AppException(ErrorCode.DATABASE_CONNECTION_FAILED);
        }
        String cid = String.valueOf(cv.getCvId());
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("success CreateCv");
        apiResponse.setData(cid);
        return apiResponse;
    }

    @Override
    public ApiResponse<Object> deleteCv(String cvid) {
        cv cv = cvMapper.selectCvByCvId(cvid);
        if(cv == null) {
            throw new AppException(ErrorCode.CV_NOT_FOUND);
        }
        int row = cvMapper.deleteCvByCvId(cvid);
        if(row <= 0) {
            throw new AppException(ErrorCode.DATABASE_CONNECTION_FAILED);
        }
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("success deleteCv");
        return apiResponse;
    }

    @Override
    public ApiResponse<Object> updateCv(cvDTOForUpdate cvDTO) {
        cv cv = cvMapper.selectCvByCvId(cvDTO.getCvId());
        if(cv == null) {
            throw new AppException(ErrorCode.CV_NOT_FOUND);
        }
        cv.setTitle(cvDTO.getTitle());
        cv.setCvDetail(cvDTO.getCvDetail());

        int row = cvMapper.updateCv(cv);
        if(row <= 0) {
            throw new AppException(ErrorCode.DATABASE_CONNECTION_FAILED);
        }
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("success UpdateCv");
        apiResponse.setData(cv);
        return apiResponse;
    }

    @Override
    public ApiResponse<cvDTO> getCvByCvId(String cvid, String uid) {
        cv cv = cvMapper.selectCvByCvId(cvid);
        if(cv == null) {
            throw new AppException(ErrorCode.CV_NOT_FOUND);
        }
        if(!cv.getStudentId().equals(uid)) {
            throw new AppException(ErrorCode.CV_NOT_OWNER);
        }

        ApiResponse<cvDTO> apiResponse = new ApiResponse<>();
        cvDTO dto =new cvDTO();
        dto.setCvId(cv.getCvId());
        dto.setStudentId(cv.getStudentId());
        dto.setCvDetail(cv.getCvDetail());
        dto.setCreatedAt(cv.getCreatedAt());
        dto.setStatus(cv.getStatus());
        dto.setTitle(cv.getTitle());
        dto.setDeleted(cv.isDeleted());

        apiResponse.setData(dto);
        apiResponse.setCode(200);
        apiResponse.setMessage("success getCvByCvId");
        return apiResponse;
    }


}
