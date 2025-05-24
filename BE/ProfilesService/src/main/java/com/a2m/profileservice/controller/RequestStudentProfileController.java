package com.a2m.profileservice.controller;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.RequestStudentsDTOs.RequestStudentsDTO;
import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTO;
import com.a2m.profileservice.service.RequestStudentService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requeststudent")
public class RequestStudentProfileController {

    private final RequestStudentService requestStudentService;

    @Autowired
    public RequestStudentProfileController(RequestStudentService requestStudentService) {
        this.requestStudentService = requestStudentService;
    }

    @PostMapping("/sendrequest")
    public ResponseEntity<ApiResponse<String>> SendResquest(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        var api=  requestStudentService.SendRequest(userId);
        return ResponseEntity.ok(api);
    }

    @GetMapping("/getrequest")
    public ResponseEntity<ApiResponse<RequestStudentsDTO>> GetRequest(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        var api = requestStudentService.GetRequestStudent(userId);
        return ResponseEntity.ok(api);
    }




}
