package com.internship.identity_service.mapper;

import com.internship.identity_service.model.AuthToken;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Mapper
public interface AuthTokenMapper {
    void save(AuthToken token);

    void revoke(String refreshToken);

    Optional<AuthToken> findByToken(@Param("token") String token);

}