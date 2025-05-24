package com.internship.recruitment_service.service.impl;

import com.internship.recruitment_service.client.StudentProfileClient;
import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.dto.ApplyJobsResponse.ApplyJobDTO;
import com.internship.recruitment_service.dto.ApplyJobsResponse.StudentProfileDTO;
import com.internship.recruitment_service.dto.TokenInfo;
import com.internship.recruitment_service.dto.message.StudentProfileUpdateMessage;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import com.internship.recruitment_service.mapper.ApplyJobsMapper;
import com.internship.recruitment_service.mapper.JobPostingsMapper;
import com.internship.recruitment_service.model.ApplyJobs;
import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.service.ApplyJobsService;
import com.internship.recruitment_service.util.NotificationUtil;
import com.internship.recruitment_service.util.TokenUtil;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ApplyJobsServiceImpl implements ApplyJobsService {

    private final StudentProfileClient studentProfileClient;
    private final ApplyJobsMapper applyJobsMapper;
    private final JobPostingsMapper jobPostingsMapper;
    private final TokenUtil tokenUtil;
    private NotificationUtil notificationUtil;


    @Override
    public void updateStudentInfoFromProfile(StudentProfileUpdateMessage msg) {
        applyJobsMapper.updateStudentInfo(
                msg.getUserId(),
                msg.getFullName(),
                msg.getDateOfBirth(),
                msg.getUniversity(),
                msg.getAvatarUrl()
        );
    }


    @Override
    @Transactional
    public ApplyJobs sendApplyJob(ApplyJobs applyJobs, HttpServletRequest request) {
        boolean existingJob = jobPostingsMapper.existsByJobId(applyJobs.getJobId());
        if (!existingJob) {
            throw new AppException(ErrorCode.JOB_NOT_FOUND);
        }

        ApplyJobs existingApplyJob = applyJobsMapper.findApplyByStudentIdAndJobId(applyJobs.getStudentId(), applyJobs.getJobId());
        if (existingApplyJob != null) {
            throw new AppException(ErrorCode.APPLY_JOB_ALREADY_EXISTS);
        }

        ApiResponse<StudentProfileDTO> response = studentProfileClient.getStudentProfiles(request.getHeader("Authorization"));
        if (response.getCode() != 200) {
            throw new AppException(ErrorCode.STUDENT_PROFILE_NOT_FOUND);
        }

        StudentProfileDTO studentProfile = response.getData();
        applyJobs.setStudentName(studentProfile.getStudentName());
        applyJobs.setStudentDateOfBirth(studentProfile.getStudentDateOfBirth());
        applyJobs.setStudentUniversity(studentProfile.getStudentUniversity());
        applyJobs.setStudentAvatarUrl(studentProfile.getStudentAvatarUrl());

        applyJobs.setApplyId(UUID.randomUUID().toString());
        applyJobs.setDeleted(false);

        applyJobsMapper.insertApplyJob(applyJobs);

        // ✅ Gửi noti nhóm cho business
        JobPostings job = jobPostingsMapper.getJobPostingEntityById(applyJobs.getJobId());
        notificationUtil.sendMultiApplyNotification(
                job.getBusinessId(),
                job.getJobId(),
                job.getTitle(),
                "", // message để NotificationService build lại
                "/business/public-job-list" ,
                List.of(applyJobs.getStudentName())
        );

        return applyJobs;
    }


    @Override
    public List<ApplyJobs> getApplyJobsByJobId(
            String jobId,
            LocalDateTime cursor,
            int limit
    ) {
        List<ApplyJobs> allApplyJobs = applyJobsMapper.getAllApplyJobsByJobId(jobId, cursor, limit);
//        if(allApplyJobs == null || allApplyJobs.isEmpty()) {
//            throw new AppException(ErrorCode.APPLY_JOB_NOT_FOUND);
//        }

        return allApplyJobs;
    }

    @Override
    public ApplyJobs getDetailApplyJobById(String applyId) {
        ApplyJobs detailApplyJob = applyJobsMapper.getDetailApplyJobByApplyId(applyId);
        if(detailApplyJob == null) {
            throw new AppException(ErrorCode.APPLY_JOB_NOT_FOUND);
        }

        // Cập nhật trạng thái đã xem
        if("pending".equalsIgnoreCase(detailApplyJob.getStatus())) {
            applyJobsMapper.updateApplyJobStatus(applyId);
            detailApplyJob.setStatus("viewed");
        }

        return detailApplyJob;
    }

    @Override
    public ApplyJobs updateAcceptOrRejectApplyJob(String applyId, String status) {
        ApplyJobs existingApplyJob = applyJobsMapper.getDetailApplyJobByApplyId(applyId);
        if (existingApplyJob == null) {
            throw new AppException(ErrorCode.APPLY_JOB_NOT_FOUND);
        }

        if (Objects.equals(existingApplyJob.getStatus(), "accepted") ||
                Objects.equals(existingApplyJob.getStatus(), "rejected")) {
            throw new AppException(ErrorCode.APPLY_JOB_ALREADY_ACCEPTED_OR_REJECTED);
        }

        String studentId = existingApplyJob.getStudentId();
        String jobTitle = existingApplyJob.getJobTitle();
        String jobId = existingApplyJob.getJobId();

        if ("accepted".equals(status)) {
            applyJobsMapper.updateApplyJobStatusAcceptOrReject(applyId, "accepted");
            existingApplyJob.setStatus("accepted");

            // ✅ Gửi thông báo "được chấp nhận"
            notificationUtil.sendNotification(
                    studentId,
                    "Đơn ứng tuyển được chấp nhận",
                    "Bạn đã được chấp nhận cho công việc: " + jobTitle,
                    "ACCEPTED",
                    "/detail-apply-job /" + applyId
            );
        } else if ("rejected".equals(status)) {
            applyJobsMapper.updateApplyJobStatusAcceptOrReject(applyId, "rejected");
            existingApplyJob.setStatus("rejected");

            // ✅ Gửi thông báo "bị từ chối"
            notificationUtil.sendNotification(
                    studentId,
                    "Đơn ứng tuyển bị từ chối",
                    "Rất tiếc! Đơn ứng tuyển của bạn cho công việc: " + jobTitle + " đã bị từ chối.",
                    "REJECTED",
                    "/detail-job/" + jobId
            );
        } else {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        return existingApplyJob;
    }



    @Override
    public List<ApplyJobDTO> getAllApplyJobsByStudentId(
            HttpServletRequest request,
            String status,
            LocalDateTime cursor,
            int limit
    ) {
        // 1. Lấy userId từ attribute (đã gán từ Filter)
        TokenInfo tokenInfo = tokenUtil.extractTokenInfo(request);
        String studentId = tokenInfo.getUserId();
        System.out.println("Student ID: " + studentId);

        if (studentId == null) {
            throw new AppException(ErrorCode.STUDENT_PROFILE_NOT_FOUND); // hoặc lỗi custom
        }

        // 2. Gọi Feign client để kiểm tra tồn tại sinh viên
        try {
            ApiResponse<?> response = studentProfileClient.checkExits(studentId);
            if (response.getCode() != 200) {
                throw new AppException(ErrorCode.STUDENT_PROFILE_NOT_FOUND);
            }
        } catch (FeignException fe) {
            throw new AppException(ErrorCode.STUDENT_PROFILE_NOT_FOUND);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while checking student profile: " + e.getMessage());
        }

        // 3. Lấy danh sách đơn ứng tuyển
        return applyJobsMapper.getAllApplyJobsByStudentId(studentId, status, cursor, limit);
    }

    @Override
    public ApplyJobs updateCvId(String applyId, String cvId) {
        // 1. Kiểm tra xem applyId có tồn tại không
        int checkApplyId = applyJobsMapper.checkApplyIdExists(applyId);
        if (checkApplyId == 0) {
            throw new AppException(ErrorCode.APPLY_JOB_NOT_FOUND);
        }

        // 2. Cập nhật cvId cho đơn ứng tuyển
        cvId = cvId.trim();
        applyJobsMapper.updateCvId(applyId, cvId);

        // 3. Lấy thông tin đơn ứng tuyển đã cập nhật
        ApplyJobs updatedApplyJob = applyJobsMapper.getDetailApplyJobByApplyId(applyId);
        if (updatedApplyJob == null) {
            throw new AppException(ErrorCode.APPLY_JOB_NOT_FOUND);
        }

        return updatedApplyJob;
    }


    //helper


}
