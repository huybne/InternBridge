package com.a2m.profileservice.mapper;

import com.a2m.profileservice.dto.student_profilesDTOs.student_profilesDTO;
import com.a2m.profileservice.model.RequestStudents;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;
import java.util.List;

@Mapper
public interface RequestStudentMapper {

    public boolean checkRequestStudentExists(String student_id);
    public boolean checkRequestStudentAlreadyRegistered(String student_id);
    public int SendRequest(String student_id);
    public RequestStudents GetRequestStudent(String student_id);



    List<RequestStudents> getAllRequestStudents();
    List<RequestStudents> getRequestStudentByStatus(String status);
    RequestStudents getRequestStudentById(@Param("requestId") String id);

    void updateRequestStudentStatus(@Param("requestId") String requestId, @Param("status") String status);

    void updateRejectReason(@Param("requestId") String requestId, @Param("reason") String reason);
    List<RequestStudents> getRequestStudentsByOffset(@Param("status") String status,
                                                     @Param("keyword") String keyword,
                                                     @Param("limit") int limit,
                                                     @Param("offset") int offset);

    int countRequestStudents(@Param("status") String status,
                             @Param("keyword") String keyword);
    String getAvatarByStudentId(@Param("studentId") String studentId);

    String getUniversityByStudentId(@Param("studentId") String studentId);



    boolean checkApproved(String id);


}
