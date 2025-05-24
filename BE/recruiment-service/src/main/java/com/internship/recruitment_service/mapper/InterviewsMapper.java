package com.internship.recruitment_service.mapper;

import com.internship.recruitment_service.dto.InterviewsResponse.InterviewScheduleDTO;
import com.internship.recruitment_service.dto.InterviewsResponse.ListScheduleDTO;
import com.internship.recruitment_service.model.Interviews;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface InterviewsMapper {

    int createInterview(Interviews interviews);
    List<InterviewScheduleDTO> getInterviewsSchedulesByJobId(
            @Param("jobId") String jobId,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    List<ListScheduleDTO> getInterviewsByStudentId(Map<String, Object> params);
    List<InterviewScheduleDTO> getInterviewsSchedulesByBusinessId(@Param("businessId") String businessId);

    int updateInterviewStatus(@Param("interviewId") String interviewId, @Param("status") String status);

    Interviews getInterviewById(@Param("interviewId") String interviewId);

    int countInterviewsSchedulesByJobId(@Param("jobId") String jobId);

    int countInterviewsByStudentId(@Param("studentId") String studentId);

    String findBusinessIdByInterviewId(@Param("interviewId") String interviewId);
    Interviews getInterviewDetailById(@Param("interviewId") String interviewId);

}
