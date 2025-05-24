package com.a2m.profileservice.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImagesBusiness {
    private String imageId;
    private String businessId;
    private String imageUrl;
    private boolean isDeleted;
    private LocalDateTime createdAt;
}
