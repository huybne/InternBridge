package com.internship.recruitment_service.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(  "http://localhost:5173",
                        "https://internship-a2m.website",
                        "https://fe.internship-a2m.website",
                        "http://18.140.1.2:5174",
                        "https://be.internship-a2m.website")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
