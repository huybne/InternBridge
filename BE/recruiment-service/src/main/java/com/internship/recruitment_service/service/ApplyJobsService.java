package com.internship.recruitment_service.service;

import com.internship.recruitment_service.dto.ApplyJobsResponse.ApplyJobDTO;
import com.internship.recruitment_service.dto.message.StudentProfileUpdateMessage;
import com.internship.recruitment_service.model.ApplyJobs;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface ApplyJobsService {

    void updateStudentInfoFromProfile(StudentProfileUpdateMessage msg);

    ApplyJobs sendApplyJob(ApplyJobs applyJobs, HttpServletRequest request);

    List<ApplyJobs> getApplyJobsByJobId(String jobId, LocalDateTime cursor, int limit);
    ApplyJobs getDetailApplyJobById(String applyId);

    ApplyJobs updateAcceptOrRejectApplyJob(String applyId, String status);

    List<ApplyJobDTO> getAllApplyJobsByStudentId(HttpServletRequest request,String status, LocalDateTime cursor, int limit);
    ApplyJobs updateCvId(String applyId, String cvId);
}
