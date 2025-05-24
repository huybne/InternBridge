package com.a2m.profileservice.dto.BusinessProfileDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.common.protocol.types.Field;

import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessProfilesDTO {
    private String profileId;
    private String companyName;
    private String industry;
    private String companyInfo;
    private String websiteUrl;
    private String taxCode;
    private String email;
    private String phoneNumber;
    private String address;
    private boolean isApproved;
    private String status;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String Image_Avatar_url;
    private List<String> imageBusiness;
}
