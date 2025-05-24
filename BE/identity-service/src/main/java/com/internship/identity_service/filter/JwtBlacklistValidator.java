package com.internship.identity_service.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtBlacklistValidator implements OAuth2TokenValidator<Jwt> {
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        String tokenValue = token.getTokenValue();

        Boolean isBlacklisted = redisTemplate.hasKey(tokenValue);
        if (Boolean.TRUE.equals(isBlacklisted)) {
            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "Token is blacklisted", null)
            );
        }
        return OAuth2TokenValidatorResult.success();
    }
}
