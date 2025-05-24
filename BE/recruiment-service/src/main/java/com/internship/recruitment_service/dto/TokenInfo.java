package com.internship.recruitment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TokenInfo {

    private List<String> roles;
    private String userId;
}
