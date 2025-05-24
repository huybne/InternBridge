package com.internship.recruitment_service.service;

import com.internship.recruitment_service.dto.InterviewsResponse.InterviewScheduleDTO;
import com.internship.recruitment_service.dto.InterviewsResponse.ListScheduleDTO;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.model.Interviews;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InterviewsService {

    Interviews setupScheduledInterview(Interviews interviews);
    PaginatedResponse<InterviewScheduleDTO> getAllInterviewsSchedules(
            String jobId,
            int offset,
            int limit
    );
    PaginatedResponse<ListScheduleDTO> getAllInterviewsSchedulesByStudentId(String studentId, int offset, int limit);
    List<InterviewScheduleDTO> getAllInterviewsSchedulesByBusinessId(String businessId);
    int updateInterviewStatus(String interviewId, String status);
}
