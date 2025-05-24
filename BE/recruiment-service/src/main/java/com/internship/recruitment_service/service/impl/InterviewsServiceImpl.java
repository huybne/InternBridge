package com.internship.recruitment_service.service.impl;

import com.internship.recruitment_service.dto.InterviewsResponse.InterviewScheduleDTO;
import com.internship.recruitment_service.dto.InterviewsResponse.ListScheduleDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import com.internship.recruitment_service.mapper.ApplyJobsMapper;
import com.internship.recruitment_service.mapper.InterviewsMapper;
import com.internship.recruitment_service.mapper.JobPostingsMapper;
import com.internship.recruitment_service.model.ApplyJobs;
import com.internship.recruitment_service.model.Interviews;
import com.internship.recruitment_service.model.JobPostings;
import com.internship.recruitment_service.service.InterviewsService;
import com.internship.recruitment_service.util.NotificationUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class InterviewsServiceImpl implements InterviewsService {

    private final InterviewsMapper interviewsMapper;
    private final ApplyJobsMapper applyJobsMapper;
    private final JobPostingsMapper jobPostingsMapper;
    private final NotificationUtil notificationUtil;

    @Override
    public Interviews setupScheduledInterview(Interviews interviews) {
        String applyId = interviews.getApplyId();
        System.out.println("applyId: " + applyId);

        // 1. Kiểm tra apply job có tồn tại không
        boolean existingApplyJob = applyJobsMapper.checkApplyIdExists(applyId) > 0;
        if (!existingApplyJob) {
            throw new AppException(ErrorCode.APPLY_JOB_NOT_FOUND);
        }

        // 2. Tạo interviewId nếu chưa có
        if (interviews.getInterviewId() == null) {
            interviews.setInterviewId(UUID.randomUUID().toString());
        }

        // 3. Tạo lịch phỏng vấn
        interviewsMapper.createInterview(interviews);

        // 4. Gửi thông báo
        try {
            ApplyJobs applyJobs = applyJobsMapper.getDetailApplyJobByApplyId(applyId);
            if (applyJobs != null) {
                String studentId = applyJobs.getStudentId();
                String jobTitle = applyJobs.getJobTitle();
                String jobId = applyJobs.getJobId();
                String scheduledTime = interviews.getScheduledAt().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));

                String content = "Bạn đã được lên lịch phỏng vấn cho công việc: " + jobTitle + " vào lúc " + scheduledTime;

                notificationUtil.sendNotification(
                        studentId,
                        content,
                        "Bạn đã được lên lịch phỏng vấn cho công việc: " + jobTitle,
                        "INTERVIEW",
                        "/detail-job/" + jobId
                );
            } else {
                System.err.println(" Không tìm thấy thông tin applyJobs để gửi noti.");
            }
        } catch (Exception e) {
            System.err.println("Không thể gửi thông báo: " + e.getMessage());
        }

        // 5. Trả về kết quả setup
        return interviews;
    }



    @Override
    public PaginatedResponse<InterviewScheduleDTO> getAllInterviewsSchedules(String jobId, int offset, int limit) {
        boolean existingJobPosting = jobPostingsMapper.existsByJobId((jobId));
        if (!existingJobPosting) {
            throw new AppException(ErrorCode.JOB_POSTING_NOT_FOUND);
        }

        List<InterviewScheduleDTO> interviewSchedules = interviewsMapper.getInterviewsSchedulesByJobId(jobId, offset, limit);
        int totalCount = interviewsMapper.countInterviewsSchedulesByJobId(jobId);
        int currentPage = (offset / limit) + 1;
        int totalPages = (int) Math.ceil((double) totalCount / limit);

        return PaginatedResponse.<InterviewScheduleDTO>builder()
                .currentPage(currentPage)
                .totalPages(totalPages)
                .pageSize(limit)
                .data(interviewSchedules)
                .build();
    }

    @Override
    public PaginatedResponse<ListScheduleDTO> getAllInterviewsSchedulesByStudentId(String studentId, int offset, int limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("studentId", studentId);
        params.put("offset", offset);
        params.put("limit", limit);

        List<ListScheduleDTO> interviewSchedules = interviewsMapper.getInterviewsByStudentId(params);
        int totalCount = interviewsMapper.countInterviewsByStudentId(studentId);
        int currentPage = (offset / limit) + 1;
        int totalPages = (int) Math.ceil((double) totalCount / limit);

        return PaginatedResponse.<ListScheduleDTO>builder()
                .currentPage(currentPage)
                .totalRecords(totalCount)
                .totalPages(totalPages)
                .pageSize(limit)
                .data(interviewSchedules)
                .build();
    }

    @Override
    public List<InterviewScheduleDTO> getAllInterviewsSchedulesByBusinessId(String businessId) {
        List<InterviewScheduleDTO> interviewSchedules = interviewsMapper.getInterviewsSchedulesByBusinessId(businessId);
        if (interviewSchedules == null || interviewSchedules.isEmpty()) {
            throw new AppException(ErrorCode.INTERVIEW_SCHEDULE_NOT_FOUND);
        }
        return interviewSchedules;
    }

    @Override
    public int updateInterviewStatus(String interviewId, String status) {
        Interviews existingInterview = interviewsMapper.getInterviewDetailById(interviewId);
        if (existingInterview == null) {
            throw new AppException(ErrorCode.INTERVIEW_SCHEDULE_NOT_FOUND);
        }

        if (!"scheduled".equalsIgnoreCase(existingInterview.getStatus())) {
            throw new AppException(ErrorCode.INTERVIEW_STATUS_NOT_PENDING);
        }

        if (!status.equalsIgnoreCase("completed") && !status.equalsIgnoreCase("cancelled")) {
            throw new AppException(ErrorCode.SCHEDULE_HAS_BEEN_EDITED);
        }

        int updatedRows = interviewsMapper.updateInterviewStatus(interviewId, status);

        // ✅ Gửi thông báo nếu tìm thấy thông tin apply
        try {
            ApplyJobs applyJobs = applyJobsMapper.getApplyJobForInterview(existingInterview.getApplyId());
                if (applyJobs != null) {
                String studentName = applyJobs.getStudentName();
                String jobTitle = applyJobs.getJobTitle();
                String businessId = interviewsMapper.findBusinessIdByInterviewId(interviewId);

                String content = "Sinh viên " + studentName +
                        ("completed".equalsIgnoreCase(status) ? " đã chấp nhận " : " đã từ chối ") +
                        "lịch phỏng vấn cho công việc: " + jobTitle;

                notificationUtil.sendNotification(
                        businessId,
                        content,
                        "Cập nhật lịch phỏng vấn: " + jobTitle,
                        "INTERVIEW_REPLY",
                        "/business/job-interview-list"
                );
            } else {
                System.err.println("⚠️ Không tìm thấy apply job để gửi thông báo.");
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi gửi thông báo cho business: " + e.getMessage());
        }

        return updatedRows;
    }

}
