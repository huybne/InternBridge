package com.internship.identity_service.model;

import lombok.*;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class User {
    private String userId;
    private String username;
    private String email;
    private String password;
    private Set<Role> roles = new HashSet<>() ;
    private LocalDateTime createdAt;
    private Status status;
    private boolean isDeleted = false ;
    private String provider;
    private String picture;

}
