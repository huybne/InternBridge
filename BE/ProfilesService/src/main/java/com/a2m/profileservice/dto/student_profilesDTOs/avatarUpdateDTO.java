package com.a2m.profileservice.dto.student_profilesDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class avatarUpdateDTO {
    private String avatarUrl;
}
