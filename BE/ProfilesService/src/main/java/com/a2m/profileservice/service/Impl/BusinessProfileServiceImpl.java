package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.BusinessProfileDTOs.BusinessProfilesDTO;
import com.a2m.profileservice.dto.BusinessProfileDTOs.BusinessProfilesForUpdate;
import com.a2m.profileservice.dto.Paging.PageResult;
import com.a2m.profileservice.dto.message.BusinessProfileUpdateMessage;
import com.a2m.profileservice.dto.response.PageResponse;
import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.mapper.BusinessProfilesMapper;
import com.a2m.profileservice.mapper.ImagesBusinessMapper;
import com.a2m.profileservice.model.BusinessProfiles;
import com.a2m.profileservice.model.ImagesBusiness;
import com.a2m.profileservice.service.BusinessProfileService;
import com.a2m.profileservice.util.ProfileUpdatePublisher;
import lombok.AllArgsConstructor;
import org.apache.kafka.common.protocol.types.Field;
import org.apache.kafka.shaded.com.google.protobuf.Api;
import org.json.JSONObject;
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
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BusinessProfileServiceImpl implements BusinessProfileService {

    private static final String IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
    private static final String PRIVATE_API_KEY = "private_e2V3fNLKwK0pGwSrEmFH+iKQtks=";
    private static final String PUBLIC_API_KEY = "public_Q+yi7A0O9A+joyXIoqM4TpVqOrQ=";

    private BusinessProfilesMapper businessProfilesMapper;
    private ImagesBusinessMapper imagesBusinessMapper;

    private final ProfileUpdatePublisher profileUpdatePublisher;

    @Override
    public BusinessProfiles businessVerifycation(BusinessProfiles businessProfiles, String profileId) {
        Optional<String> existingTaxCode = businessProfilesMapper.findByTaxCode(businessProfiles.getTaxCode());
        BusinessProfiles existingBusiness = businessProfilesMapper.getBusinessProfileById(profileId);
        if(existingTaxCode.isPresent() || existingBusiness != null) {
            throw new AppException(ErrorCode.BUSINESS_EXISTED);
        }

        if(businessProfiles.getCreatedAt() == null) {
            businessProfiles.setCreatedAt(LocalDateTime.now());
        }

        businessProfiles.setProfileId(profileId);
        businessProfiles.setApproved(false);
//        businessProfiles.setStatus("inactive");
        businessProfiles.setDeleted(false);

        businessProfilesMapper.businessVerifycation(businessProfiles, profileId);
        return businessProfiles;
    }

    @Override
    public Optional<String> findByTaxCode(String taxCode) {
        String existingTaxCode = businessProfilesMapper.findByTaxCode(taxCode).orElse(null);
        if (existingTaxCode != null) {
            return Optional.of(existingTaxCode);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public BusinessProfiles getBusinessProfileById(String profileId){
        BusinessProfiles existingBusinessProfile = businessProfilesMapper.getBusinessProfileById(profileId);
        if(existingBusinessProfile == null){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }
        return existingBusinessProfile;
    }

    @Override
    public BusinessProfiles getBusinessProfileByIdAny(String profileId) {
        BusinessProfiles existingBusinessProfile = businessProfilesMapper.getBusinessProfileById(profileId);
        if(existingBusinessProfile == null){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }
        return existingBusinessProfile;
    }

    @Override
    public BusinessProfiles updateBusinessProfile(BusinessProfiles businessProfiles, String businessId) {
        BusinessProfiles existingBusinessProfile = businessProfilesMapper.getBusinessProfileById(businessId);
        if(existingBusinessProfile == null){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }

        if(!existingBusinessProfile.isApproved()){
            throw new AppException(ErrorCode.BUSINESS_NOT_AUTHORIZED);
        } else {
            if(Objects.equals(existingBusinessProfile.getStatus(), "active")) { // nếu đã acp thì không cho sửa
                throw new AppException(ErrorCode.BUSINESS_NOT_AUTHORIZED);
            }else {
                existingBusinessProfile.setCompanyName(businessProfiles.getCompanyName());
                existingBusinessProfile.setIndustry(businessProfiles.getIndustry());
                existingBusinessProfile.setCompanyInfo(businessProfiles.getCompanyInfo());
                existingBusinessProfile.setWebsiteUrl(businessProfiles.getWebsiteUrl());
                existingBusinessProfile.setEmail(businessProfiles.getEmail());
                existingBusinessProfile.setPhoneNumber(businessProfiles.getPhoneNumber());
                existingBusinessProfile.setAddress(businessProfiles.getAddress());
                existingBusinessProfile.setUpdatedAt(LocalDateTime.now());

            }
        }
        businessProfilesMapper.updateBusinessProfile(existingBusinessProfile);
        profileUpdatePublisher.sendBusinessProfileUpdate(
                new BusinessProfileUpdateMessage(
                        businessId,
                        existingBusinessProfile.getCompanyName(),
                        existingBusinessProfile.getImage_Avatar_url()
                )
        );

        return existingBusinessProfile;
    }

    @Override
    public ApiResponse<Boolean> checkProfileExist(String profileId) {
        var existingBusinessProfile = businessProfilesMapper.checkProfileExist(profileId);
        if(existingBusinessProfile==false){
            throw new AppException(ErrorCode.BUSINESS_Not_PROFILE);
        }
        var api = new ApiResponse<Boolean>();
        api.setCode(200);
        api.setData(existingBusinessProfile);
        api.setMessage("profile exist");
        return api;
    }

    @Override
    public ApiResponse<?> updateBusinessProfileAfterFix(BusinessProfilesForUpdate businessProfiles, String businessId) {
        BusinessProfiles businessProfilesenity = BusinessProfiles.builder().profileId(businessId)
                .companyName(businessProfiles.getCompanyName())
                .industry(businessProfiles.getIndustry())
                .companyInfo(businessProfiles.getCompanyInfo())
                .websiteUrl(businessProfiles.getWebsiteUrl())
                .taxCode(businessProfiles.getTaxCode())
                .email(businessProfiles.getEmail())
                .phoneNumber(businessProfiles.getPhoneNumber())
                .address(businessProfiles.getAddress())
                .updatedAt(LocalDateTime.now())
                .build();
        var row = businessProfilesMapper.updateBusinessProfileAfterFix(businessProfilesenity);
        if(row<=0){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }

        List<ImagesBusiness> imagesBusinesses = imagesBusinessMapper.getImagesBusinessByBusinessId(businessId);
        List<String> imagesBusinessesOld = imagesBusinesses.stream().map(ImagesBusiness::getImageId).collect(Collectors.toList());
        List<String> imgNew = businessProfiles.getImagesOldImg();
        if (imgNew == null) {
            imgNew = new ArrayList<>(); // hoặc return luôn nếu null là hợp lệ
        }
        List<String> diff = getDifference(imagesBusinessesOld, imgNew);


        System.out.println("cardid diff: "+diff.size());
        for (String s : diff) {
            int r = imagesBusinessMapper.deleteImagesBusinessById(s);
            if (r != 1) {
                throw new AppException(ErrorCode.DATABASE_CONNECTION_FAILED);
            }
        }

        ApiResponse<?> api = new ApiResponse<Boolean>();
        api.setCode(200);
        api.setMessage("profile update successful");
        return api;
    }

    @Override
    public ApiResponse<PageResult<BusinessProfilesDTO>> getAllBusinessProfiles(String search, int isApproved, int offset, int limit) {
        List<BusinessProfiles> businessProfiles = businessProfilesMapper.getAllBusinessProfiles(search, isApproved, offset, limit);
        List<BusinessProfilesDTO> businessProfilesDTOS = businessProfiles.stream().map(bp ->
                BusinessProfilesDTO.builder()
                        .profileId(bp.getProfileId())
                        .companyName(bp.getCompanyName())
                        .industry(bp.getIndustry())
                        .companyInfo(bp.getCompanyInfo())
                        .websiteUrl(bp.getWebsiteUrl())
                        .taxCode(bp.getTaxCode())
                        .email(bp.getEmail())
                        .phoneNumber(bp.getPhoneNumber())
                        .address(bp.getAddress())
                        .isApproved(bp.isApproved())
                        .status(bp.getStatus())
                        .isDeleted(bp.isDeleted())
                        .createdAt(bp.getCreatedAt())
                        .updatedAt(bp.getUpdatedAt())
                        .Image_Avatar_url(bp.getImage_Avatar_url()).build()).toList();
        int count  = businessProfilesMapper.CountAllBusinessProfiles(search, isApproved);
        PageResult<BusinessProfilesDTO> pageResult = new PageResult<>();
        int totalPage = (int) Math.ceil((double) count / (double) limit);
        pageResult.setTotalPages(totalPage);
        pageResult.setItems(businessProfilesDTOS);
        pageResult.setTotalCount(count);
        pageResult.setOffset(offset+1);
        pageResult.setLimit(limit);
        ApiResponse<PageResult<BusinessProfilesDTO>> apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("get business profiles successful");
        apiResponse.setData(pageResult);
        return apiResponse;
    }

    @Override
    public BusinessProfilesDTO getBusinessProfileById_2(String profileId) {
        BusinessProfiles businessProfiles = businessProfilesMapper.getBusinessProfileById(profileId);
        if(businessProfiles==null){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }
        List<ImagesBusiness> imagesBusinesses = imagesBusinessMapper.getImagesBusinessByBusinessId(profileId);

        BusinessProfilesDTO businessProfilesDTO = new BusinessProfilesDTO();
        businessProfilesDTO.setProfileId(businessProfiles.getProfileId());
        businessProfilesDTO.setCompanyName(businessProfiles.getCompanyName());
        businessProfilesDTO.setIndustry(businessProfiles.getIndustry());
        businessProfilesDTO.setCompanyInfo(businessProfiles.getCompanyInfo());
        businessProfilesDTO.setWebsiteUrl(businessProfiles.getWebsiteUrl());
        businessProfilesDTO.setTaxCode(businessProfiles.getTaxCode());
        businessProfilesDTO.setEmail(businessProfiles.getEmail());
        businessProfilesDTO.setPhoneNumber(businessProfiles.getPhoneNumber());
        businessProfilesDTO.setAddress(businessProfiles.getAddress());
        businessProfilesDTO.setDeleted(businessProfiles.isDeleted());
        businessProfilesDTO.setCreatedAt(businessProfiles.getCreatedAt());
        businessProfilesDTO.setUpdatedAt(businessProfiles.getUpdatedAt());
        businessProfilesDTO.setStatus(businessProfiles.getStatus());
        businessProfilesDTO.setApproved(businessProfiles.isApproved());
        businessProfilesDTO.setImage_Avatar_url(businessProfiles.getImage_Avatar_url());

        List<String> img_url = imagesBusinesses.stream().map(ImagesBusiness::getImageUrl).collect(Collectors.toList());
        businessProfilesDTO.setImageBusiness(img_url);

        return businessProfilesDTO;
    }

    @Override
    public boolean updateStatusBusinessProfileById(String profileId) {
        String statusBusiness = businessProfilesMapper.getStatusBusinessProfileById(profileId);
//        if(statusBusiness==null){
//            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
//        }
        int r = 0;
        if(statusBusiness.equals("active")){
            r= businessProfilesMapper.updateStatusBusinessProfileById(profileId, "inactive");
        }
        else if(statusBusiness.equals("inactive")){
            r= businessProfilesMapper.updateStatusBusinessProfileById(profileId, "active");
        }
        if(r==0){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }
        return true;
    }

    @Override
    public String addImagesAvatarBusiness(MultipartFile file, String businessId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String folderPath = "Business/" + businessId;
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
            var url = json.getString("url");
            int row= businessProfilesMapper.addImagevatrBusinessProfile(businessId, url);
            if(row==0){
                throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
            }
            return url;
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi đọc file: " + e.getMessage();
        }
    }

    @Override
    public String getCompanyNameById(String profileId) {
        String name = businessProfilesMapper.getCompanyNameById(profileId);
        return name;
    }

    private List<String> getDifference(List<String> oldid, List<String> newids) {
        // Tạo một bản sao của list1 để giữ nguyên list1 ban đầu
        List<String> difference = new ArrayList<>(oldid);
        // Loại bỏ tất cả các phần tử có trong list2 khỏi difference
        difference.removeAll(newids);
        return difference;
    }
}
