package com.a2m.profileservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Áp dụng cho tất cả API
                        .allowedOrigins("http://localhost:5173") // Cho phép domain nào
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Cho phép method nào
                        .allowedHeaders("*") // Cho tất cả headers
                        .allowCredentials(true); // Nếu cần gửi cookie
            }
        };
    }
}
