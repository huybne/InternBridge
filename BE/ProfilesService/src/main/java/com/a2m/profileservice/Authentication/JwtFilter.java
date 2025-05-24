package com.a2m.profileservice.Authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/student_profiles/checkExits",
            "/api/auth/login",
            "/swagger-ui",
            "/v3/api-docs",
            "/swagger-ui.html",
            "/api/v1/business/status"
    };

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        System.out.println(path);
        for (String publicEndpoint : PUBLIC_ENDPOINTS) {
            if (path.startsWith(publicEndpoint)) {
                System.out.println("sang");
                return true;

            }else{
                System.out.println("not sang");
            }
        }
        return false;
    }
    private String extractTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String requestURI = request.getRequestURI();

        String token = extractTokenFromRequest(request);
        System.out.printf("sang: "+token);
        System.out.println(token != null);

        if (token == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token is missing or invalid");
            return;
        }
        if (token != null) {
            try {
                String email = jwtUtil.extractSubject(token);
                System.out.println("email: "+email);
                if (email != null && !jwtUtil.isTokenExpired(token)) {
                    String role = jwtUtil.extractRoleFromToken(token); // Giả sử có hàm này
                    String roles = jwtUtil.extractRoleFromToken2(token);
                    String idstr = jwtUtil.extractUserId(token);
                    System.out.println("filter"+idstr);
                    request.setAttribute("userId", idstr);
                    request.setAttribute("roles", roles);
                    request.setAttribute("role", role);
                    request.setAttribute("email", email);
                    System.out.println("User authenticated with email: " + email);
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(email, null, null));
                }
            } catch (Exception e) {
                // Có thể ghi log lỗi: logger.debug("Invalid JWT: " + e.getMessage());
                System.out.println("Error processing JWT: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}
