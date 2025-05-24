package com.internship.identity_service.controller;

import com.internship.identity_service.exception.AppException;
import com.internship.identity_service.service.AuthenticationService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/api/v1/auth")
public class AuthViewController {
    private final AuthenticationService service;

    public AuthViewController(AuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/verify")
    public String verifyToken(@RequestParam("token") String token, Model model) {
        try {
            String message = service.verifyToken(token);
            model.addAttribute("message", message);
            return "verify-success";
        } catch (AppException e) {
            return "verify-fail";
        }
    }
    @GetMapping("/login")
    public String showLoginPage() {
        return "login"; // Thymeleaf sẽ render templates/login.html
    }

}
