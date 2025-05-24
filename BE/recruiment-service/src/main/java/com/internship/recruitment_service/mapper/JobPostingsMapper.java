package com.internship.recruitment_service.mapper;

import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsRequestDTO;
import com.internship.recruitment_service.dto.JobPostingsResponse.JobPostingsResponseDTO;
import com.internship.recruitment_service.model.JobPostings;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface JobPostingsMapper {

    int createJobPosting(JobPostings jobPosting);

    int updateJobPosting(JobPostingsRequestDTO jobPostingsRequestDTO);
    int updateJobPostingStatus(
            @Param("jobId") String jobId,
            @Param("status") int status,
            @Param("reasonReject") String reasonReject
    );

    int sendJobPostingForApproval(
            @Param("jobId") String jobId
    );

    int softDeleteJob(
            @Param("jobId") String jobId
    );

    List<JobPostingsResponseDTO> getJobsByBusinessId(
        Map<String, Object> params
    );

    List<JobPostingsResponseDTO> getJobsPublicByBusinessId(
            Map<String, Object> params
    );

    List<JobPostingsResponseDTO> getDraftJobsByBusinessId(
            @Param("businessId") String businessId
    );

    List<JobPostingsResponseDTO> getAllPendingJobs();

    List<JobPostingsResponseDTO> getAllJobPostings();
    List<JobPostingsResponseDTO> getPublicJobPostings(@Param("offset") int offset, @Param("limit") int limit);

    //sang
    List<JobPostingsResponseDTO> searchPublicJobPostings(@Param("offset") int offset,
                                                   @Param("limit") int limit,
                                                   @Param("searchkeyword") String searchkeyword,
                                                   @Param("location") String location,
                                                   @Param("company_name") String company_name,
                                                   @Param("isurgen") int isurgen,
                                                   @Param("categoryid") int[] categoryid,
                                                   @Param("sortByexpirationDate") boolean sortByexpirationDate);


    int countJobPostings(String searchkeyword,String location,String company_name,int isurgen,int[] categoryid);


    JobPostings getJobPostingEntityById(
            @Param("jobId") String jobId
    );

    JobPostingsResponseDTO getDetailJobById(
            @Param("jobId") String jobId
    );

    JobPostingsResponseDTO getPublicJobDetailById(
            @Param("jobId") String jobId
    );

    boolean existsByJobId(@Param("jobId") String jobId);

    int countJobPostingsByStatus(@Param("status") int status);
    List<JobPostings> getJobPostingsByBusinessidPublic(@Param("businessId") String bId, int offset, int limit);
    int CountJobPostingsByBusinessidPublic(@Param("businessId") String bId);

    int countJobsByBusinessId(
            @Param("businessId") String businessId
    );

    void updateJobPostingHide(
            @Param("jobId") String jobId
    );

    void updateJobPostingUnHide(
            @Param("jobId") String jobId
    );


    List<JobPostingsResponseDTO> getAllJobByStatus(Map<String, Object> params);
    int countAllJobByStatus(Map<String, Object> params);

    List<JobPostings> getJobPostingFarvourite(String userId);

    List<JobPostingsResponseDTO> getRandomJobPostings();


    void updateBusinessInfo(
            @Param("userId") String userId,
            @Param("companyName") String companyName,
            @Param("avatarUrl") String avatarUrl
    );

}
