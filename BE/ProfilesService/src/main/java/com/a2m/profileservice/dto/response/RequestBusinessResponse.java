package com.a2m.profileservice.dto.response;


import com.a2m.profileservice.model.RequestBusinesses;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestBusinessResponse {
    private RequestBusinesses request;
    private String industry;
    private String companyName;
    private String logoUrl;
}
