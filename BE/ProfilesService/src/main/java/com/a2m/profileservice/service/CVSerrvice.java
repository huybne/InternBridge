package com.a2m.profileservice.service;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.cvDTOs.cvDTO;
import com.a2m.profileservice.dto.cvDTOs.cvDTOForCreate;
import com.a2m.profileservice.dto.cvDTOs.cvDTOForUpdate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CVSerrvice {
    public ApiResponse<List<cvDTO>> getCvByUserID(String id, String search);
    public ApiResponse<String> CreateCv(cvDTOForCreate cvDTO , String id);
    public ApiResponse<Object> deleteCv(String cvid);
    public ApiResponse<Object> updateCv(cvDTOForUpdate cvDTO);
    public ApiResponse<cvDTO> getCvByCvId(String cvid, String uid);
}
