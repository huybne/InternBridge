package com.internship.identity_service.dto.response;

import com.internship.identity_service.model.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String userId;
    @NotNull
    private String username;
    @NotNull
    private String email;

    private Integer roleId ;


}
