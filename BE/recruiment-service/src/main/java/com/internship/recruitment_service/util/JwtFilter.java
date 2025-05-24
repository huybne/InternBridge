package com.internship.recruitment_service.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

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
        String requestURI = request.getRequestURI();

        String token = extractTokenFromRequest(request);
        System.out.printf("sang: "+token);
        System.out.println(token != null);
        if (token != null) {
            try {
                String email = jwtUtil.extractSubject(token);
                System.out.println("email: "+email);
                if (email != null && !jwtUtil.isTokenExpired(token)) {
                    List<String> roles = jwtUtil.extractRolesFromToken(token); // Giả sử có hàm này
                    String idstr = jwtUtil.extractUserId(token);
                    System.out.println("filter"+idstr);
                    request.setAttribute("userId", idstr);
                    request.setAttribute("email", email);
                    System.out.println("User authenticated with email: " + email);

                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .toList();
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, token, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Có thể ghi log lỗi: logger.debug("Invalid JWT: " + e.getMessage());
                System.out.println("Error processing JWT: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }

}
