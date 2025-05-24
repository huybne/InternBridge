package com.internship.identity_service.service;

import com.internship.identity_service.dto.request.*;
import com.internship.identity_service.dto.response.*;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException, Exception;

    AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response);


    AuthenticationGGResponse outboundAuthenticate(String code, HttpServletResponse response);

    AuthenticationResponse authenticate(LoginRequest request);


    AuthenticationResponse refreshToken(String refreshToken);

   // RefreshAccessTokenResponse refreshAccessToken(RefreshTokenRequest request);

    String verifyToken(String secureToken);

    void logout(String refreshToken, String accessToken);


    ChangePasswordResponse changePassword(ChangePasswordRequest request, HttpServletRequest httpRequest, HttpServletResponse response);

    void register(RegisterRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

 //   AuthenticationResponse handleGoogleLogin(String token) throws GeneralSecurityException, IOException;
}
