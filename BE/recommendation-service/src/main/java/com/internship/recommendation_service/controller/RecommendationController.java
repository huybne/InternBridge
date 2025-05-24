package com.internship.recommendation_service.controller;

import com.internship.recommendation_service.dto.request.LogRequest;
import com.internship.recommendation_service.service.LogService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final LogService logService;

    @PostMapping("/log-view")
    public ResponseEntity<?> logJobView(@RequestBody LogRequest request) {
        logService.logJobView(request.getStudentId(), request.getJobId());
        return ResponseEntity.ok(Map.of("message", "Log saved"));
    }


}