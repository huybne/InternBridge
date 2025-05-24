package com.internship.recruitment_service.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JobCategories {

    private Integer jobCategoryId;
    private String jobId;
    private String categoryId;
    private boolean isDeleted;
}
