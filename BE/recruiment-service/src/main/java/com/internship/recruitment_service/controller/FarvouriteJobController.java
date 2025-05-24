package com.internship.recruitment_service.controller;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import com.internship.recruitment_service.dto.student_favorite_jobsResponse.JobAddFarvorite;
import com.internship.recruitment_service.service.FavoriteJobService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/farvouritejob")
public class FarvouriteJobController {
    private final FavoriteJobService favoriteJobService;

    @Autowired
    public FarvouriteJobController(FavoriteJobService favoriteJobService) {
        this.favoriteJobService = favoriteJobService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> createFarvouriteJob(HttpServletRequest request, @RequestBody JobAddFarvorite jobAddFarvorite) {
        String userId = (String) request.getAttribute("userId");
        System.out.println("Creating Farvourite Job");
        var check = favoriteJobService.addFavoriteJob(userId, jobAddFarvorite.getJobId());
        var api = new ApiResponse<Boolean>();
        api.setData(check);
        api.setCode(200);
        api.setMessage("Success");
        return ResponseEntity.ok(api);
    }


    @PutMapping("/remove")
    public ResponseEntity<?> removeFarvouriteJob(HttpServletRequest request, @RequestBody JobAddFarvorite jobAddFarvorite){
        String userId = (String) request.getAttribute("userId");
        System.out.println("remove Farvourite Job");
        var check = favoriteJobService.removeFavoriteJob(userId, jobAddFarvorite.getJobId());
        var api = new ApiResponse<Boolean>();
        api.setData(check);
        api.setCode(200);
        api.setMessage("Success");
        return ResponseEntity.ok(api);
    }

    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<JobPostingsResponseDTO>>> getFarvouriteJob(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        var list = favoriteJobService.getAllFavoriteJobs(userId);
        ApiResponse<List<JobPostingsResponseDTO>> response = new ApiResponse<>();
        response.setMessage("Success");
        response.setCode(200);
        response.setData(list);
        return ResponseEntity.ok(response);
    }


}
