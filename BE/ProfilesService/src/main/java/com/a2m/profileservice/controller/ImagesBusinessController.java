package com.a2m.profileservice.controller;

import com.a2m.profileservice.Authentication.JwtUtil;
import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.model.ImagesBusiness;
import com.a2m.profileservice.service.ImageKitUploadService;
import com.a2m.profileservice.service.ImagesBusinessUploadService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/business/images")
public class ImagesBusinessController {

    private ImageKitUploadService imageKitUploadService;
    private final ImagesBusinessUploadService imagesBusinessUploadService;
    private final JwtUtil jwtUtil;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImagesBusiness(@RequestPart("files")
            List<MultipartFile> files, HttpServletRequest request
    ) {
        String businessId = (String) jwtUtil.extractUserId(request.getHeader("Authorization").substring(7));

        List<ImagesBusiness> res = imagesBusinessUploadService.addImagesBusiness(files, businessId);
        ApiResponse<List<ImagesBusiness>> response = ApiResponse.<List<ImagesBusiness>>builder()
                .code(1000)
                .message("Images uploaded successfully")
                .data(res)
                .build();

        return ResponseEntity.ok(response.getData());
    }

    @PutMapping("/delete/{imageId}")
    public ResponseEntity<?> deleteImagesBusiness(
            @PathVariable("imageId") String imageId
    ) {
        int res = imagesBusinessUploadService.deleteImagesBusiness(imageId);
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(1000)
                .message("Delete image successfully")
                .data(res)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllImagesBusinessByBusinessId(
            HttpServletRequest request
    ) {
        String businessId = (String) jwtUtil.extractUserId(request.getHeader("Authorization").substring(7));

        List<ImagesBusiness> res = imagesBusinessUploadService.getImagesBusinessByBusinessId(businessId);
        ApiResponse<List<ImagesBusiness>> response = ApiResponse.<List<ImagesBusiness>>builder()
                .code(1000)
                .message("Get all images successfully")
                .data(res)
                .build();

        return ResponseEntity.ok(response.getData());
    }

    @GetMapping("/avatar")
    public ResponseEntity<?> getFirstImageBusinessByBusinessId(
            HttpServletRequest request
    ) {
        String businessId = (String) jwtUtil.extractUserId(request.getHeader("Authorization").substring(7));

       ImagesBusiness res = imagesBusinessUploadService.getFirstImageBusinessByBusinessId(businessId);
        ApiResponse<ImagesBusiness> response = ApiResponse.<ImagesBusiness>builder()
                .code(1000)
                .message("Get first image successfully")
                .data(res)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImagesBusiness2(@RequestPart("files") List<MultipartFile> files, HttpServletRequest request
    ) {
        String userId = (String) request.getAttribute("userId");
        String response = imageKitUploadService.uploadImagesBusiness(files, userId);
        return ResponseEntity.ok(response);
    }
}
