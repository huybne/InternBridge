package com.a2m.profileservice.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessProfiles {
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
}
