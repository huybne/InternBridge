package com.a2m.profileservice.dto.BusinessProfileDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessProfilesForUpdate {
    //private String profileId;
    private String companyName;
    private String industry;
    private String companyInfo;
    private String websiteUrl;
    private String taxCode;
    private String email;
    private String phoneNumber;
    private String address;
    private List<String> imagesOldImg;
}
