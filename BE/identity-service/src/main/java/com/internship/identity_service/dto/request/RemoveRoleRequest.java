package com.internship.identity_service.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RemoveRoleRequest {
    private String userId;
    private String roleName;
}
