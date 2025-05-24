package com.internship.identity_service.dto.response;

import com.internship.identity_service.model.Role;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Data
@Getter
@Setter
@Builder
public class MyInfoResponse {
    private String id;
    private String username;
    private String email;
    private List<String> roleNames;
    private String avatar;

}
