package com.internship.identity_service.dto.request;

import com.internship.identity_service.model.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserCreateRequest {
    @NotBlank
    private String email;

    @NotBlank(message = "username is required")
    private String username;

    @NotBlank
    private String password;

    private Integer roleId;

    private Status status;
}
