package com.internship.identity_service.dto.request;

import com.internship.identity_service.model.Status;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserUpdateRequest {
    private String userId;
    private String username;
    private String email;
    private Integer roleId;
    private Status status;
}
