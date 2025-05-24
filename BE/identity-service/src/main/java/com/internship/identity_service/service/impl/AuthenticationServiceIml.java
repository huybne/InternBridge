    package com.internship.identity_service.service.impl;

    import com.internship.identity_service.dto.request.*;
    import com.internship.identity_service.dto.response.*;
    import com.internship.identity_service.exception.AppException;
    import com.internship.identity_service.exception.ErrorCode;
    import com.internship.identity_service.mapper.AuthTokenMapper;
    import com.internship.identity_service.mapper.UserMapper;
    import com.internship.identity_service.httpclient.OutboundIdentityClient;
    import com.internship.identity_service.httpclient.OutboundUserClient;
    import com.internship.identity_service.model.AuthToken;
    import com.internship.identity_service.model.Role;
    import com.internship.identity_service.model.Status;
    import com.internship.identity_service.model.User;
    import com.internship.identity_service.service.AuthenticationService;
    import com.internship.identity_service.service.EmailService;
    import com.internship.identity_service.service.UserService;
    import com.internship.identity_service.util.SecurityUtil;
    import com.nimbusds.jose.*;
    import com.nimbusds.jose.crypto.RSASSASigner;
    import com.nimbusds.jose.crypto.RSASSAVerifier;
    import com.nimbusds.jwt.JWTClaimsSet;
    import com.nimbusds.jwt.SignedJWT;
    import feign.FeignException;
    import jakarta.servlet.http.Cookie;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;
    import lombok.RequiredArgsConstructor;
    import lombok.experimental.NonFinal;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.data.redis.core.RedisTemplate;
    import org.springframework.http.*;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.springframework.web.client.RestTemplate;

    import java.security.KeyFactory;
    import java.security.interfaces.RSAPrivateKey;
    import java.security.interfaces.RSAPublicKey;
    import java.security.spec.PKCS8EncodedKeySpec;
    import java.security.spec.X509EncodedKeySpec;
    import java.time.Instant;
    import java.time.LocalDateTime;
    import java.util.*;
    import java.util.concurrent.TimeUnit;

    @Service
    @RequiredArgsConstructor
    public class AuthenticationServiceIml implements AuthenticationService {
        private static final Logger log = LoggerFactory.getLogger(AuthenticationServiceIml.class);

        private final UserMapper userMapper;
        private final RedisTemplate<String, String> redisTemplate;
        private final AuthTokenMapper authTokenMapper;
        private final BCryptPasswordEncoder passwordEncoder;
        private final UserService userService;
        private final EmailService emailService;
        private final OutboundIdentityClient outboundIdentityClient;
        private final OutboundUserClient outboundUserClient;
        private final RestTemplate restTemplate;
        @NonFinal
        @Value("${spring.security.oauth2.client.registration.google.client-id}")
        protected String CLIENT_ID;

        @NonFinal
        @Value("${spring.security.oauth2.client.registration.google.client-secret}")
        protected String CLIENT_SECRET;

        @NonFinal
        @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
        protected String REDIRECT_URI;


        @NonFinal
        @Value("${jwt.secret.privateKey}")
        protected String privateKeyPem;

        @Value("${jwt.secret.publicKey}")
        protected String publicKeyPem;

        @Value("${jwt.access.token.lifetime}")
        protected long accessTokenLifetime;

        @Value("${jwt.refresh.token.lifetime}")
        protected long refreshTokenLifetime;

        @NonFinal
        protected final String   GRANT_TYPE = "authorization_code";

        @Override
        public AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
            String refreshToken = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

            AuthToken token = authTokenMapper.findByToken(refreshToken)
                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

            if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            User user = userMapper.findById(token.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            revokeRefreshToken(refreshToken);

            TokenPair tokenPair = createNewTokenPair(user);

            // Gán lại cookie
            setRefreshTokenCookie(response, tokenPair.refreshToken());


            return AuthenticationResponse.builder()
                    .authenticated(true)
                    .token(tokenPair.accessToken())
                    .build();
        }

        @Override
        public AuthenticationGGResponse outboundAuthenticate(String code, HttpServletResponse response) {
            try {
                ExchangeTokenRequest request = ExchangeTokenRequest.builder()
                        .code(code)
                        .clientId(CLIENT_ID)
                        .clientSecret(CLIENT_SECRET)
                        .redirectUri(REDIRECT_URI)
                        .grantType("authorization_code")
                        .build();

                var tokenResponse = outboundIdentityClient.exchangeToken(request);

                log.info("Token response: {}", tokenResponse);

                // Tiếp theo: dùng access_token để gọi lấy thông tin user
                GoogleUserInfo userInfo = getUserInfo(tokenResponse.getAccessToken());

                Optional<User> userExisted = userMapper.findByEmail(userInfo.getEmail());

                User user;
                if(userExisted.isEmpty()){
                    user = new User();
                    user.setUserId(UUID.randomUUID().toString());
                    user.setEmail(userInfo.getEmail());
                    user.setUsername(userInfo.getName());
                    user.setPassword("");
                    user.setStatus(Status.active);
                    user.setDeleted(false);
                    user.setProvider("oauth2");

                    userMapper.insertUser(user);
                    userMapper.insertUserRole(user.getUserId(), 2);

                }else{
                    user = userExisted.get();
                }
                user = userMapper.findByEmail(user.getEmail()).orElseThrow();

                TokenPair tokenPair = createNewTokenPair(user);

                String cookieString = String.format(
                        "refreshToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=Lax",
                        tokenPair.refreshToken(),
                        refreshTokenLifetime
                );
                response.addHeader("Set-Cookie", cookieString);

                // 6. Return response
                return AuthenticationGGResponse.builder()
                        .id(user.getUserId())
                        .accessToken(tokenPair.accessToken())
                        .email(user.getEmail())
                        .name(user.getUsername())
                        .picture(userInfo.getPicture())
                        .roleNames(user.getRoles()
                                .stream()
                                .map(Role::getRoleName)
                                .toList())
                        .build();

            } catch (FeignException e) {
                log.error("Feign error during token exchange: {} - {}", e.status(), e.contentUTF8());
                throw new RuntimeException("Error during token exchange", e);
            }

        }
        public GoogleUserInfo getUserInfo(String accessToken) {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<GoogleUserInfo> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    request,
                    GoogleUserInfo.class
            );

            return response.getBody();
        }
        @Override
        public AuthenticationResponse authenticate(LoginRequest request) {
            var user = userMapper.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            if(!user.getProvider().equals("local")){
                throw new AppException(ErrorCode.INVALID_LOGIN);
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.INVALID_CREDENTIALS);
            }

            String roleName = getRoleNameFromUser(user);
            TokenPair tokens = createNewTokenPair(user);

            return AuthenticationResponse.builder()
                    .token(tokens.accessToken())
                    .refreshToken(tokens.refreshToken())
                    .authenticated(true)
                    .build();
        }

//        @Override
//        public RefreshAccessTokenResponse refreshAccessToken(RefreshTokenRequest request) {
//            AuthToken token = authTokenMapper.findByToken(request.getRefreshToken())
//                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
//
//            if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
//                throw new AppException(ErrorCode.UNAUTHORIZED);
//            }
//
//            User user = userMapper.findById(token.getUserId())
//                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//
//            String roleName = getRoleNameFromUser(user);
//            String newAccessToken = generateAccessToken(user.getEmail(), user.getUserId(), roleName);
//
//            return new RefreshAccessTokenResponse(newAccessToken);
//        }

        @Override
        public AuthenticationResponse refreshToken(String refreshToken) {
            AuthToken token = authTokenMapper.findByToken(refreshToken)
                    .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

            if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            revokeRefreshToken(refreshToken);

            User user = userMapper.findById(token.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            String roleName = getRoleNameFromUser(user);
            TokenPair tokens = createNewTokenPair(user);
            log.info("🔁 Incoming refreshToken: {}", refreshToken);
            log.info("🗂️ Token record: {}", token);
            log.info("⛔ Token revoked: {}, expired: {}", token.isRevoked(), token.getExpiresAt().isBefore(LocalDateTime.now()));

            return AuthenticationResponse.builder()
                    .token(tokens.accessToken())
                    .refreshToken(tokens.refreshToken())
                    .authenticated(true)
                    .build();
        }

        @Override
        public void logout(String refreshToken, String accessToken) {
            Optional<AuthToken> tokenOpt = authTokenMapper.findByToken(refreshToken);
            log.info("Saving refreshToken to DB: {}", tokenOpt);

            AuthToken token = tokenOpt.orElseThrow(() -> new AppException(ErrorCode.INVALID_REFRESH_TOKEN));

            if (token.isRevoked()) {
                throw new AppException(ErrorCode.TOKEN_ALREADY_REVOKED);
            }

            revokeRefreshToken(refreshToken);
            blacklistAccessToken(accessToken);
        }

        @Override
        public ChangePasswordResponse changePassword(ChangePasswordRequest request, HttpServletRequest httpRequest, HttpServletResponse response) {
            String userId = SecurityUtil.getCurrentUserId();
            User user = userMapper.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
            }

            userMapper.updatePassword(userId, passwordEncoder.encode(request.getNewPassword()));

            String currentAccessToken = Optional.ofNullable(httpRequest.getHeader("Authorization"))
                    .filter(h -> h.startsWith("Bearer "))
                    .map(h -> h.substring(7))
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_ACCESS_TOKEN));
            String currentRefreshToken = Arrays.stream(Optional.ofNullable(httpRequest.getCookies()).orElse(new Cookie[0]))
                            .filter(cookie -> "refreshToken".equals(cookie.getName()))
                            .map(Cookie::getValue)
                            .findFirst()
                            .orElseThrow(() -> new AppException(ErrorCode.INVALID_REFRESH_TOKEN));
            revokeRefreshToken(currentRefreshToken);
            blacklistAccessToken(currentAccessToken);

            String roleName = getRoleNameFromUser(user);
            TokenPair tokenPair = createNewTokenPair(user);

            setRefreshTokenCookie(response, tokenPair.refreshToken());


            return ChangePasswordResponse.builder()
                    .success(true)
                    .newAccessToken(tokenPair.accessToken())
                    .build();
        }

        @Override
        public void register(RegisterRequest request) {
            if (userMapper.existsByEmailAndNotDeleted(request.getEmail())) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            String secureToken = UUID.randomUUID().toString();
            String key = "verify_token:" + secureToken;

            Map<String, String> userData = Map.of(
                    "email", request.getEmail(),
                    "username", request.getUsername(),
                    "password", passwordEncoder.encode(request.getPassword())
            );

            redisTemplate.opsForHash().putAll(key, userData);
            redisTemplate.expire(key, 5, TimeUnit.MINUTES);

            emailService.sendVerificationEmail(request.getEmail(), secureToken);
        }

        @Override
        public String verifyToken(String secureToken) {
            String key = "verify_token:" + secureToken;
            Map<Object, Object> data = redisTemplate.opsForHash().entries(key);

            if (data.isEmpty()) {
                throw new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN);
            }

            RegisterRequest request = new RegisterRequest();
            request.setEmail((String) data.get("email"));
            request.setUsername((String) data.get("username"));
            request.setPassword((String) data.get("password"));

            userService.registerUser(request);
            redisTemplate.delete(key);

            return "Tài khoản đã được xác minh và tạo thành công.";
        }

        @Override
        public IntrospectResponse introspect(IntrospectRequest request) throws Exception {
            SignedJWT jwt = SignedJWT.parse(request.getToken());

            String cleanKey = publicKeyPem
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");
            RSAPublicKey publicKey = (RSAPublicKey) KeyFactory.getInstance("RSA")
                    .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(cleanKey)));

            boolean verified = jwt.verify(new RSASSAVerifier(publicKey));
            boolean notExpired = jwt.getJWTClaimsSet().getExpirationTime().after(new Date());
            boolean blacklisted = redisTemplate.hasKey(request.getToken());

            return IntrospectResponse.builder()
                    .valid(verified && notExpired && !blacklisted)
                    .build();
        }

        @Override
        public void forgotPassword(ForgotPasswordRequest request) {
            User user = userMapper.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            String token = UUID.randomUUID().toString();
            String key = "forgot_password:" + token;

            redisTemplate.opsForValue().set(key, user.getEmail(), 5, TimeUnit.MINUTES);

            String resetLink = "https://fe.internship-a2m.website/reset-password?token=" + token;

            emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        }

        @Override
        public void resetPassword(ResetPasswordRequest request) {
            String key = "forgot_password:" + request.getToken();
            String email = redisTemplate.opsForValue().get(key);

            if (email == null) {
                throw new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN);
            }

            User user = userMapper.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            userMapper.updatePassword(user.getUserId(), passwordEncoder.encode(request.getNewPassword()));
            redisTemplate.delete(key);
        }


        //Helper Methods
        private void setRefreshTokenCookie(HttpServletResponse response, String token) {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Lax") // hoặc bỏ luôn
                    .path("/")
                    .maxAge(refreshTokenLifetime)
                    .build();
            response.setHeader("Set-Cookie", cookie.toString());
        }

        private String generateAccessToken(String email, String userId, List<String> roles) {
            try {
                String cleanKey = privateKeyPem
                        .replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replaceAll("\\s", "");
                RSAPrivateKey privateKey = (RSAPrivateKey) KeyFactory.getInstance("RSA")
                        .generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode(cleanKey)));

                JWTClaimsSet claims = new JWTClaimsSet.Builder()
                        .subject(email)
                        .issuer("huybui.vn")
                        .issueTime(new Date())
                        .expirationTime(Date.from(Instant.now().plusSeconds(accessTokenLifetime)))
                        .claim("uid", userId)
                        .claim("roles", roles)
                        .build();

                SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.RS256), claims);
                jwt.sign(new RSASSASigner(privateKey));
                return jwt.serialize();
            } catch (Exception e) {
                log.error("Token generation failed", e);
                throw new RuntimeException("Token generation error");
            }
        }

        private void saveNewRefreshToken(String userId, String refreshToken) {
            authTokenMapper.save(AuthToken.builder()
                    .tokenId(UUID.randomUUID().toString())
                    .userId(userId)
                    .token(refreshToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenLifetime))
                    .revoked(false)
                    .build());
        }

        private void blacklistAccessToken(String accessToken) {
            try {
                SignedJWT jwt = SignedJWT.parse(accessToken);
                Date exp = jwt.getJWTClaimsSet().getExpirationTime();
                long ttl = (exp.getTime() - System.currentTimeMillis()) / 1000;
                redisTemplate.opsForValue().set(accessToken, "blacklisted", ttl, TimeUnit.SECONDS);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse access token", e);
            }
        }

        private void revokeRefreshToken(String refreshToken) {
            authTokenMapper.revoke(refreshToken);
        }

        private TokenPair createNewTokenPair(User user) {
            List<String> roleNames =  user.getRoles()
                    .stream()
                    .map(Role::getRoleName)
                    .toList();
            String accessToken = generateAccessToken(user.getEmail(), user.getUserId(), roleNames);
            String refreshToken = UUID.randomUUID().toString();
            saveNewRefreshToken(user.getUserId(), refreshToken);
            return new TokenPair(accessToken, refreshToken);
        }

        private String getRoleNameFromUser(User user) {
            return user.getRoles().stream()
                    .findFirst()
                    .map(Role::getRoleName)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        }

    }
