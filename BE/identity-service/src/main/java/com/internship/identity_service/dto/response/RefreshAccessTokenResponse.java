package com.internship.identity_service.dto.response;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
public class RefreshAccessTokenResponse {
    private String token;

}
