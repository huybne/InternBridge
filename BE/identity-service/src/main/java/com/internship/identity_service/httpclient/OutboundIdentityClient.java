package com.internship.identity_service.httpclient;

import com.internship.identity_service.dto.request.ExchangeTokenRequest;
import com.internship.identity_service.dto.response.ExchangeTokenResponse;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "outbound-identity", url = "https://oauth2.googleapis.com")
public interface OutboundIdentityClient {

    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Headers("Content-Type: application/x-www-form-urlencoded")
    ExchangeTokenResponse exchangeToken(@RequestBody ExchangeTokenRequest request);
}