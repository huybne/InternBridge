package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.mapper.ImagesBusinessMapper;
import com.a2m.profileservice.model.ImagesBusiness;
import com.a2m.profileservice.service.ImagesBusinessUploadService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ImagesBusinessUploadServiceImpl implements ImagesBusinessUploadService {

    private final ImagesBusinessMapper imagesBusinessMapper;

    private static final String IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
    private static final String PRIVATE_API_KEY = "private_e2V3fNLKwK0pGwSrEmFH+iKQtks=";
    private static final String PUBLIC_API_KEY = "public_Q+yi7A0O9A+joyXIoqM4TpVqOrQ=";
    private final RestTemplate restTemplate = new RestTemplate();

    // Hàm nén ảnh JPEG với chất lượng khoảng 70%
    private byte[] compressImage(MultipartFile file) throws Exception {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(originalImage, "jpg", baos); // Bạn có thể dùng lib nén như Thumbnailator nếu cần
        return baos.toByteArray();
    }

    @Override
    public List<ImagesBusiness> addImagesBusiness(List<MultipartFile> files, String businessId) {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                // Nén ảnh
                byte[] compressedImage = compressImage(file);

                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("file", new ByteArrayResource(compressedImage) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                });
                body.add("fileName", file.getOriginalFilename());
                body.add("folder", "businessId/" + businessId);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                headers.setBasicAuth(PRIVATE_API_KEY, "");

                HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.postForEntity(
                        IMAGEKIT_UPLOAD_URL,
                        request,
                        String.class
                );

                // Parse JSON để lấy URL
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                if (root.has("url")) {
                    String url = root.get("url").asText();
                    imageUrls.add(url);
                } else {
                    System.err.println("No 'url' field in response: " + response.getBody());
                    imageUrls.add("Upload failed: " + file.getOriginalFilename());
                }


            } catch (Exception e) {
                e.printStackTrace();
                imageUrls.add("Upload failed: " + file.getOriginalFilename());
            }
        }

        for(String url : imageUrls) {
            ImagesBusiness imagesBusiness = new ImagesBusiness();
            imagesBusiness.setImageId(UUID.randomUUID().toString());
            imagesBusiness.setImageUrl(url);
            imagesBusiness.setBusinessId(businessId);
            imagesBusiness.setDeleted(false);
            if(imagesBusiness.getCreatedAt() == null) {
                imagesBusiness.setCreatedAt(LocalDateTime.now());
            }

            imagesBusinessMapper.insertImagesBusiness(imagesBusiness);
        }
        return imagesBusinessMapper.getImagesBusinessByBusinessId(businessId);
    }

    @Override
    public int deleteImagesBusiness(String imageId) {
        ImagesBusiness existingImage = imagesBusinessMapper.getImagesBusinessByImageId(imageId);
        if(existingImage == null) {
            throw new AppException(ErrorCode.BUSINESS_IMAGE_NOT_FOUND);
        }

        int result = imagesBusinessMapper.deleteImagesBusinessById(imageId);
        if(result == 0) {
            throw new AppException(ErrorCode.BUSINESS_IMAGE_NOT_FOUND);
        }
        return result;
    }

    @Override
    public List<ImagesBusiness> getImagesBusinessByBusinessId(String businessId) {
        List<ImagesBusiness> imagesBusinessList = imagesBusinessMapper.getImagesBusinessByBusinessId(businessId);
        if(imagesBusinessList.isEmpty()) {
            throw new AppException(ErrorCode.BUSINESS_IMAGE_NOT_FOUND);
        }

        return imagesBusinessList;

    }

    @Override
    public ImagesBusiness getFirstImageBusinessByBusinessId(String businessId) {
        ImagesBusiness firstImage = imagesBusinessMapper.getFirstImageBusinessByBusinessId(businessId);
        if(firstImage == null) {
            throw new AppException(ErrorCode.BUSINESS_IMAGE_NOT_FOUND);
        }
        return firstImage;
    }


}
