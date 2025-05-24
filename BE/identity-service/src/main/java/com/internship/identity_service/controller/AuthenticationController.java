package com.internship.identity_service.controller;

import com.internship.identity_service.dto.ApiResponse;
import com.internship.identity_service.dto.request.*;
import com.internship.identity_service.dto.response.*;
import com.internship.identity_service.exception.AppException;
import com.internship.identity_service.exception.ErrorCode;
import com.internship.identity_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(@RequestBody LoginRequest request, HttpServletResponse httpServletResponse) {
        var  result = service.authenticate(request);

        Cookie refreshTokenCookie = new Cookie("refreshToken", result.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(30 * 24 * 60 * 60);
        httpServletResponse.addCookie(refreshTokenCookie);

        result.setRefreshToken(null);

        ApiResponse<AuthenticationResponse> response = ApiResponse.<AuthenticationResponse>builder()
                .code(result.isAuthenticated() ? 1000 : 1003)
                .message(result.isAuthenticated() ? "Login successful" : "Invalid credentials")
                .data(result)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/instrospect")
    public ResponseEntity<ApiResponse<IntrospectResponse>> instrospect(@RequestBody IntrospectRequest request)
            throws Exception {

        var result = service.introspect(request);

        ApiResponse<IntrospectResponse> response = ApiResponse.<IntrospectResponse>builder()
                .message("Introspect successfully")
                .data(result)
                .build();

        return ResponseEntity.ok(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @CookieValue("refreshToken") String refreshToken,
            @RequestHeader("Authorization") String accessTokenHeader) {
//        log.info(">>> REFRESH TOKEN: " + refreshToken);
//        log.info(">>> ACCESS TOKEN: " + accessTokenHeader);
        String accessToken = accessTokenHeader.replace("Bearer ", "");
        service.logout(refreshToken, accessToken);
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) //khi nào dùng HTTPS nhớ bật
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .message("Logout successful")
                        .data("Logged out")
                        .build());
    }



    @PostMapping("/rotate-refresh")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> rotateRefreshToken(@RequestBody RefreshTokenRequest request) {
        AuthenticationResponse result = service.refreshToken(request.getRefreshToken());

        ApiResponse<AuthenticationResponse> response = ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .message("Refresh Token refreshed successfully")
                .data(result)
                .build();

        return ResponseEntity.ok(response);
    }

//    @PostMapping("/refresh")
//    public ResponseEntity<ApiResponse<RefreshAccessTokenResponse>> refreshAccessToken(
//            @RequestBody RefreshTokenRequest request
//    ) {
//        RefreshAccessTokenResponse result = service.refreshAccessToken(request);
//
//        ApiResponse<RefreshAccessTokenResponse> response = ApiResponse.<RefreshAccessTokenResponse>builder()
//                .code(1000)
//                .message("Token refreshed successfully")
//                .data(result)
//                .build();
//
//        return ResponseEntity.ok(response);
//    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        AuthenticationResponse authResponse = service.refreshToken(request, response);
        log.info("🔁 Called refreshToken(HttpServletRequest, HttpServletResponse)");

        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .message("Token refreshed successfully")
                .data(authResponse)
                .build());
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest request) {
        service.register(request);
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .code(1000)
                        .message("Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.")
                        .data("Email sent to " + request.getEmail())
                        .build()
        );
    }

    @PutMapping("/change-pass")
    public ResponseEntity<ApiResponse<ChangePasswordResponse>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        ChangePasswordResponse result = service.changePassword(request, httpRequest, httpResponse);

        return ResponseEntity.ok(ApiResponse.<ChangePasswordResponse>builder()
                .code(1000)
                .message("Change Password Successfully")
                .data(result)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Object>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        service.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(1000)
                .message("Reset password email sent successfully")
                .data(null)
                .build());
    }

    @PutMapping("/reset")
    public ResponseEntity<ApiResponse<Object>> resetPassword(@RequestBody ResetPasswordRequest request) {
        service.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(1000)
                .message("Password has been reset successfully")
                .data(null)
                .build());
    }


    @PostMapping("/outbound/authentication")
    public ApiResponse<AuthenticationGGResponse> outboundAuthenticate(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        var result = service.outboundAuthenticate(code, response);
        log.info("Received authorization code: {}", code);
        return ApiResponse.<AuthenticationGGResponse>builder()
                .code(1000)
                .message("Google login successful")
                .data(result)
                .build();
    }



}
