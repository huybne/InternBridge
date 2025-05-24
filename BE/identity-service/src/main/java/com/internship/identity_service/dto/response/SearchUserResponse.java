package com.internship.identity_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchUserResponse {
    private String userId;
    private String username;
    private String email;
    private List<String> roleNames;
}
