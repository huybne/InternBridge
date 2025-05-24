package com.internship.identity_service.controller;

import com.internship.identity_service.dto.request.ChangePasswordRequest;
import com.internship.identity_service.dto.request.ResetPasswordRequest;
import com.internship.identity_service.exception.AppException;
import com.internship.identity_service.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ViewController {
    private final AuthenticationService service;
    private final RedisTemplate redisTemplate;

    public ViewController(AuthenticationService service, @Qualifier("redisTemplate") RedisTemplate redisTemplate) {
        this.service = service;
        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/verify")
    public String verifyEmail(@RequestParam("token") String token, Model model) {
        try {
            String message = service.verifyToken(token);
            model.addAttribute("message", message);
            return "verify-success";
        } catch (AppException e) {
            model.addAttribute("error", e.getMessage());
            return "verify-fail";
        }
    }


}
