package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.mapper.ImagesBusinessMapper;
import com.a2m.profileservice.mapper.RequestStudentMapper;
import com.a2m.profileservice.mapper.StudentCardMapper;
import com.a2m.profileservice.mapper.StudentProfilesMapper;
import com.a2m.profileservice.model.ImagesBusiness;
import com.a2m.profileservice.model.StudentCard;
import com.a2m.profileservice.service.ImageKitUploadService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageKitUploadServiceImpl implements ImageKitUploadService {
    private static final String IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
    private static final String PRIVATE_API_KEY = "private_e2V3fNLKwK0pGwSrEmFH+iKQtks=";
    private static final String PUBLIC_API_KEY = "public_Q+yi7A0O9A+joyXIoqM4TpVqOrQ=";

    private final StudentProfilesMapper mapper;
    private final StudentCardMapper studentCardMapper;
    private final RequestStudentMapper requestStudentMapper;
    private final ImagesBusinessMapper imagesBusinessMapper;

    @Autowired
    public ImageKitUploadServiceImpl(StudentProfilesMapper mapper, StudentCardMapper studentCardMapper, RequestStudentMapper requestStudentMapper, ImagesBusinessMapper imagesBusinessMapper) {
        this.mapper = mapper;
        this.studentCardMapper = studentCardMapper;
        this.requestStudentMapper = requestStudentMapper;
        this.imagesBusinessMapper = imagesBusinessMapper;
    }

    @Override
    public String uploadImage(MultipartFile file, String profileId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String folderPath = "Student/" + profileId;
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });
            body.add("fileName", file.getOriginalFilename());
            body.add("folder", folderPath);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBasicAuth(PRIVATE_API_KEY, "");

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    IMAGEKIT_UPLOAD_URL,
                    request,
                    String.class
            );

            JSONObject json = new JSONObject(response.getBody());
            var url = json.getString("url"); // Trả về link ảnh
            mapper.UpdateAvatar(url, profileId);
            return url;
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi đọc file: " + e.getMessage();
        }
    }


    @Override
    public String uploadImages(List<MultipartFile> files, String profileId) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            StringBuilder responseBuilder = new StringBuilder();
            String folderPath = "Student/" + profileId;
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                    body.add("file", new ByteArrayResource(file.getBytes()) {
                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename(); // tên file
                        }
                    });
                    body.add("fileName", file.getOriginalFilename());
                    body.add("folder", folderPath);
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                    headers.setBasicAuth(PRIVATE_API_KEY, "");

                    HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

                    ResponseEntity<String> response = restTemplate.postForEntity(
                            IMAGEKIT_UPLOAD_URL,
                            request,
                            String.class
                    );

                    responseBuilder.append(response.getBody()).append("\n"); // Append each file response
                } else {
                    responseBuilder.append("File is empty or invalid.\n");
                }
            }

            String api = responseBuilder.toString(); // Return response of each upload
            List<String> urls = new ArrayList<>();
            urls = extractUrlsFromRawJson(api);

            for (String url : urls) {
                studentCardMapper.CreateStudentCard(StudentCard.builder().studentId(profileId).studentCardUrl(url).build());
            }
            return api;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error while uploading files: " + e.getMessage();
        }
    }

    @Override
    public String uploadImagesBusiness(List<MultipartFile> files, String Business_id) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            StringBuilder responseBuilder = new StringBuilder();
            String folderPath = "Business/" + Business_id;
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                    body.add("file", new ByteArrayResource(file.getBytes()) {
                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename(); // tên file
                        }
                    });
                    body.add("fileName", file.getOriginalFilename());
                    body.add("folder", folderPath);
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                    headers.setBasicAuth(PRIVATE_API_KEY, "");

                    HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

                    ResponseEntity<String> response = restTemplate.postForEntity(
                            IMAGEKIT_UPLOAD_URL,
                            request,
                            String.class
                    );

                    responseBuilder.append(response.getBody()).append("\n"); // Append each file response
                } else {
                    responseBuilder.append("File is empty or invalid.\n");
                }
            }

            String api = responseBuilder.toString(); // Return response of each upload
            List<String> urls = new ArrayList<>();
            urls = extractUrlsFromRawJson(api);

            for (String url : urls) {
                ImagesBusiness imagesBusiness = new ImagesBusiness();
                imagesBusiness.setImageId(UUID.randomUUID().toString());
                imagesBusiness.setImageUrl(url);
                imagesBusiness.setBusinessId(Business_id);
                imagesBusiness.setDeleted(false);
                if (imagesBusiness.getCreatedAt() == null) {
                    imagesBusiness.setCreatedAt(LocalDateTime.now());
                }

                imagesBusinessMapper.insertImagesBusiness(imagesBusiness);
            }

            return api;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error while uploading files: " + e.getMessage();
        }
    }

    private List<String> extractUrlsFromRawJson(String rawString) {
        List<String> urls = new ArrayList<>();

        // Tách chuỗi theo dòng (mỗi dòng là 1 JSON object)
        String[] lines = rawString.split("\\r?\\n");

        for (String line : lines) {
            if (line.trim().isEmpty()) continue; // bỏ dòng trống

            JSONObject obj = new JSONObject(line.trim()); // parse từng JSON object
            if (obj.has("url")) {
                urls.add(obj.getString("url"));
            }
        }

        return urls;
    }

    @Override
    public String uploadCV(MultipartFile file, String profileId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String folderPath = "CV/" + profileId;
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename(); // tên file
                }
            });
            body.add("fileName", file.getOriginalFilename());
            body.add("folder", folderPath);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBasicAuth(PRIVATE_API_KEY, "");

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    IMAGEKIT_UPLOAD_URL,
                    request,
                    String.class
            );

            return response.getBody(); // JSON response
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi đọc file: " + e.getMessage();
        }
    }


}
