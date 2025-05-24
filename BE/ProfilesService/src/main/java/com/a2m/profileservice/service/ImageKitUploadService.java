package com.a2m.profileservice.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageKitUploadService {
    public String uploadImage(MultipartFile file, String profileId);
    public String uploadImages(List<MultipartFile> files, String profileId);
    public String uploadCV(MultipartFile file, String profileId);
    public String uploadImagesBusiness(List<MultipartFile> files, String profileId);
}
