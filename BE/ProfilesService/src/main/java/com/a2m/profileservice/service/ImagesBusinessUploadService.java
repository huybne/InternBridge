package com.a2m.profileservice.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import com.a2m.profileservice.model.ImagesBusiness;
public interface ImagesBusinessUploadService {
    List<ImagesBusiness> addImagesBusiness(List<MultipartFile> images, String businessId);
    int deleteImagesBusiness(String imageId);

    List<ImagesBusiness> getImagesBusinessByBusinessId(String businessId);

    ImagesBusiness getFirstImageBusinessByBusinessId(String businessId);
}
