package com.internship.identity_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

@Data
@Getter
@Setter
public class RoleRequest {
    @NotBlank(message = "Role name must not be blank")
    private String roleName;
    private String permissions;
}
