package com.internship.identity_service.model;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Role {
    private Integer roleId;
    private String roleName;
    private String permissions;
    private LocalDateTime createdAt;
}
