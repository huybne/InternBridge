package com.internship.identity_service.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateUserRolesRequest {
    private String userId;
    private List<Integer> roleIds;
}