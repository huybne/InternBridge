package com.a2m.profileservice.controller;

import com.a2m.profileservice.Authentication.JwtUtil;
import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.BusinessProfileDTOs.BusinessProfilesDTO;
import com.a2m.profileservice.dto.BusinessProfileDTOs.BusinessProfilesForUpdate;
import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.model.BusinessProfiles;
import com.a2m.profileservice.service.BusinessProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/business")
@AllArgsConstructor
public class BusinessProfileController {

    private final BusinessProfileService businessProfileService;
    private final JwtUtil jwtUtil;

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<BusinessProfiles>> businessVerifycation(
            @RequestBody BusinessProfiles businessProfiles, HttpServletRequest request
    ) {
//        String authHeader = request.getHeader("Authorization");
//        System.out.println("Auth header = " + authHeader);
        String token = request.getHeader("Authorization").substring(7);
        String role = jwtUtil.extractRoleFromToken2(token);
        System.out.println("Verify request: "+role);
        System.out.println(role == null||role.equals(""));
        System.out.println(!role.contains("BUSINESS"));
        if (role == null||role.equals("")) {
            return ResponseEntity.status(403).body(ApiResponse.<BusinessProfiles>builder()
                    .code(403)
                    .message("Role not found in token")
                    .build());
        }

        if (!role.contains("BUSINESS")) {
            return ResponseEntity.status(403).body(ApiResponse.<BusinessProfiles>builder()
                    .code(403)
                    .message("You are not authorized to perform this action")
                    .build());
        }

        String profileId = jwtUtil.extractUserId(token);

        if (profileId == null) {
            return ResponseEntity.status(403).body(ApiResponse.<BusinessProfiles>builder()
                    .code(403)
                    .message("Profile ID not found in token")
                    .build());
        }

        System.out.println("Profile id = " + profileId);

        BusinessProfiles newBusiness = businessProfileService.businessVerifycation(businessProfiles, profileId);
        ApiResponse<BusinessProfiles> response = ApiResponse.<BusinessProfiles>builder()
                .code(1000)
                .message("Business profile created successfully")
                .data(newBusiness)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BusinessProfiles>> getBussinessProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.<BusinessProfiles>builder()
                    .code(401)
                    .message("Missing or invalid Authorization header")
                    .build());
        }

        String token = authHeader.substring(7);
        String role = jwtUtil.extractRoleFromToken2(token);

        if (role == null||role.equals("")) {
            return ResponseEntity.status(403).body(ApiResponse.<BusinessProfiles>builder()
                    .code(403)
                    .message("Role not found in token")
                    .build());
        }

        if (!role.contains("BUSINESS")) {
            return ResponseEntity.status(403).body(ApiResponse.<BusinessProfiles>builder()
                    .code(403)
                    .message("You are not authorized to perform this action")
                    .build());
        }

        String profileId = jwtUtil.extractUserId(token);
        BusinessProfiles existingBusiness = businessProfileService.getBusinessProfileById(profileId);

        ApiResponse<BusinessProfiles> response = ApiResponse.<BusinessProfiles>builder()
                .code(1000)
                .data(existingBusiness)
                .message("Business profile found")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/business-profile/{profileId}")
    public ResponseEntity<ApiResponse<BusinessProfiles>> getBusinessProfileById(@PathVariable String profileId) {
        BusinessProfiles existingBusiness = businessProfileService.getBusinessProfileByIdAny(profileId);
        ApiResponse<BusinessProfiles> response = ApiResponse.<BusinessProfiles>builder()
                .code(1000)
                .data(existingBusiness)
                .message("Business profile found")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/business-profile2/{profileId}")
    public ResponseEntity<ApiResponse<BusinessProfilesDTO>> getBusinessProfileById2(@PathVariable String profileId) {
//        BusinessProfiles existingBusiness = businessProfileService.getBusinessProfileByIdAny(profileId);
//        ApiResponse<BusinessProfiles> response = ApiResponse.<BusinessProfiles>builder()
//                .code(1000)
//                .data(existingBusiness)
//                .message("Business profile found")
//                .build();
//        return ResponseEntity.ok(response);

        var api = businessProfileService.getBusinessProfileById_2(profileId);
        if(api.isApproved()==false){
            throw new AppException(ErrorCode.BUSINESS_NOT_FOUND);
        }
        ApiResponse<BusinessProfilesDTO> apiResponse = new ApiResponse<>();
        apiResponse.setData(api);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return ResponseEntity.ok(apiResponse);
    }


    @PutMapping("/update")
    public ResponseEntity<ApiResponse<BusinessProfiles>> updateBusinessProfile(
            @RequestBody BusinessProfilesForUpdate businessProfiles,
            HttpServletRequest request
    ) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(ApiResponse.<BusinessProfiles>builder()
                        .code(401)
                        .message("Missing or invalid Authorization header")
                        .build());
            }

            String businessId = jwtUtil.extractUserId(authHeader.substring(7));
            var updatedBusiness = businessProfileService.updateBusinessProfileAfterFix(businessProfiles, businessId);

            ApiResponse<BusinessProfiles> response = ApiResponse.<BusinessProfiles>builder()
                    .code(1000)
                    .message("Business profile updated successfully")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // để thấy lỗi 500 thật sự
            return ResponseEntity.status(500).body(ApiResponse.<BusinessProfiles>builder()
                    .code(500)
                    .message("Internal Server Error: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/checkprofilexits")
    public ResponseEntity<ApiResponse<?>> checkProfileXits(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        var api = businessProfileService.checkProfileExist(userId);
        return ResponseEntity.ok(api);
    }



    @PostMapping(value = "/uploadavatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadAvatar(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        String  url = businessProfileService.addImagesAvatarBusiness(file, userId);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setData(url);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return ResponseEntity.ok(apiResponse);
    }


    @GetMapping("/getCompanyname")
    public ResponseEntity<ApiResponse<String>> getCompanyname(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        String name  = businessProfileService.getCompanyNameById(userId);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setData(name);
        apiResponse.setMessage("Success");
        apiResponse.setCode(200);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/status/{profileId}")
    public ResponseEntity<ApiResponse<BusinessProfiles>> getBusinessProfileByIdAny(@PathVariable String profileId) {
        BusinessProfiles existingBusiness = businessProfileService.getBusinessProfileByIdAny(profileId);
        ApiResponse<BusinessProfiles> response = ApiResponse.<BusinessProfiles>builder()
                .code(1000)
                .data(existingBusiness)
                .message("Business profile found")
                .build();
        return ResponseEntity.ok(response);
    }















}
