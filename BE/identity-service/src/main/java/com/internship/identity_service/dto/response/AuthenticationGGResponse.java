package com.internship.identity_service.dto.response;

import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class AuthenticationGGResponse {
    String id;
    String email;
    String name;
    String picture;
    String accessToken;
    List<String> roleNames;

}
