package com.internship.recruitment_service.dto.JobPostingsResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvatarBusinessDTO {

    @JsonProperty("image_Avatar_url")
    private String avatarUrl;
}
