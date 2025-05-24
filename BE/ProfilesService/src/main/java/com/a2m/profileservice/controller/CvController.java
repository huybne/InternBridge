package com.a2m.profileservice.controller;

import com.a2m.profileservice.dto.ApiResponse;
import com.a2m.profileservice.dto.cvDTOs.cvDTO;
import com.a2m.profileservice.dto.cvDTOs.cvDTOForCreate;
import com.a2m.profileservice.dto.cvDTOs.cvDTOForUpdate;
import com.a2m.profileservice.service.CVSerrvice;
import com.a2m.profileservice.service.ImageKitUploadService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.QueryParam;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv")
public class CvController {
    private final CVSerrvice cvSerrvice;
    private final ImageKitUploadService imageKitUploadService;
    @Autowired
    public CvController(CVSerrvice cvSerrvice, ImageKitUploadService imageKitUploadService) {
        this.cvSerrvice = cvSerrvice;
        this.imageKitUploadService = imageKitUploadService;
    }

    @GetMapping("/getcvByid")
    public ResponseEntity<?> GetCvByUserID(HttpServletRequest request, @RequestParam(name = "search", required = false) String search) {
        String userId = (String) request.getAttribute("userId");
        var api = cvSerrvice.getCvByUserID(userId, search);
        return ResponseEntity.ok(api);
    }

    @GetMapping("/getcvByid/{cvid}")
    public ResponseEntity<?> GetCvByCvid(HttpServletRequest request, @PathVariable String cvid) {
        String userId = (String) request.getAttribute("userId");
        var api = cvSerrvice.getCvByCvId(cvid, userId);
        return ResponseEntity.ok(api);
    }

    // get cv by cv id by Phuc
    @GetMapping("/get-cv/{cvId}/{studentId}")
    public ResponseEntity<?> GetCvByCvidAndStudentId(@PathVariable String cvId, @PathVariable String studentId) {
        var api = cvSerrvice.getCvByCvId(cvId, studentId);
        return ResponseEntity.ok(api);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> UploadCv(HttpServletRequest request,@RequestParam("file") MultipartFile file) {
        String userId = (String) request.getAttribute("userId");
        var api = imageKitUploadService.uploadCV(file, userId);
        return ResponseEntity.ok(api);
    }

    @PostMapping(value = "/create")
    public ResponseEntity<ApiResponse<String>> UploadCv(HttpServletRequest request, @RequestBody cvDTOForCreate dto) {
        String userId = (String) request.getAttribute("userId");
        ApiResponse<String> cvid = cvSerrvice.CreateCv(dto, userId);
        return ResponseEntity.ok(cvid);
    }

    @PutMapping("/update")
    public ResponseEntity<?> UpdateCv(HttpServletRequest request, @RequestBody cvDTOForUpdate dto) {
        var api = cvSerrvice.updateCv(dto);
        return ResponseEntity.ok(api);
    }

    @DeleteMapping("/delete/{cvid}")
    public ResponseEntity<?> DeleteCv(HttpServletRequest request, @PathVariable String cvid) {
        String userId = (String) request.getAttribute("userId");
        var api = cvSerrvice.deleteCv(cvid);
        return ResponseEntity.ok(api);
    }
}
