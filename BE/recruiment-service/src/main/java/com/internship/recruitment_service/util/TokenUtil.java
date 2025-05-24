package com.internship.recruitment_service.util;

import com.internship.recruitment_service.dto.TokenInfo;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class TokenUtil {
    private final JwtUtil jwtUtil;

    public TokenInfo extractTokenInfo(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        token = token.substring(7); // Bỏ "Bearer " prefix
        List<String> roles = jwtUtil.extractRolesFromToken(token);
        String userId = jwtUtil.extractUserId(token);

        return new TokenInfo(roles, userId);
    }

    // Optional: Thêm phương thức kiểm tra quyền
    public void checkBusinessRole(TokenInfo tokenInfo) {
        if (tokenInfo.getUserId() == null ||
                tokenInfo.getRoles() == null ||
                !tokenInfo.getRoles().contains("BUSINESS")) {
            throw new AppException(ErrorCode.NOT_AUTHORIZED);
        }
    }

    public void checkStudentRole(TokenInfo tokenInfo) {
        if (tokenInfo.getUserId() == null ||
                tokenInfo.getRoles() == null ||
                !tokenInfo.getRoles().contains("STUDENT")) {
            throw new AppException(ErrorCode.NOT_AUTHORIZED);
        }
    }

    public void checkAdminRole(TokenInfo tokenInfo) {
        List<String> roles = tokenInfo.getRoles();
        if (tokenInfo.getUserId() == null || roles == null ||
                (!roles.contains("ADMIN") && !roles.contains("STAFF_ADMIN"))) {
            throw new AppException(ErrorCode.NOT_AUTHORIZED);
        }
    }




}
