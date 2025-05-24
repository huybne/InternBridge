package com.internship.recruitment_service.mapper;

import com.internship.recruitment_service.dto.ApplyJobsResponse.ApplyJobDTO;
import com.internship.recruitment_service.model.ApplyJobs;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ApplyJobsMapper {

    int insertApplyJob(ApplyJobs applyJobs);

    List<ApplyJobs> getAllApplyJobsByJobId(
            @Param("jobId") String jobId,
            @Param("cursor") LocalDateTime cursor,
            @Param("limit") int limit
    );

    ApplyJobs getDetailApplyJobByApplyId(@Param("applyId") String applyId);

    int updateApplyJobStatus(@Param("applyId") String applyId);
    int updateApplyJobStatusAcceptOrReject(@Param("applyId") String applyId, @Param("status") String status);

    int checkApplyIdExists(@Param("applyId") String applyId);

    ApplyJobs findApplyByStudentIdAndJobId(@Param("studentId") String studentId,@Param("jobId") String jobId);

    List<ApplyJobDTO> getAllApplyJobsByStudentId(
            @Param("studentId") String studentId,
            @Param("status") String status,
            @Param("cursor") LocalDateTime cursor,
            @Param("limit") int limit
    );
    ApplyJobs getApplyJobForInterview(@Param("applyId") String applyId);

    void updateCvId(@Param("applyId") String applyId, @Param("cvId") String cvId);

    void updateStudentInfo(
            @Param("userId") String userId,
            @Param("fullName") String fullName,
            @Param("dateOfBirth") LocalDate dateOfBirth,
            @Param("university") String university,
            @Param("avatarUrl") String avatarUrl
    );


}
