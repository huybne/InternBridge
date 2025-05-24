package com.a2m.profileservice.service;

import com.a2m.profileservice.dto.PageResponseOffset;
import com.a2m.profileservice.dto.request.UpdateRequestStatus;
import com.a2m.profileservice.dto.response.*;

import java.util.List;

public interface StaffAdminService {

    List<RequestBusinessResponse> getAllRequestBusinessesWithCompanyName();

    List<RequestBusinessResponse> getRequestBusinessesByStatus(String status);


    List<RequestStudentResponse> getRequestStudentsByStatus(String status);

    List<RequestStudentResponse> getAllRequestStudentsWithName();

    RequestBusinessDetailResponse getRequestBusinessesById(String id);

    RequestStudentDetailResponse getRequestStudentById(String id);


    void updateRequestBusinessStatus(UpdateRequestStatus request);

    void updateRequestStudentStatus(UpdateRequestStatus request);

    //cursor pagination


    PageResponseOffset<RequestStudentResponse> getRequestStudentsByOffset(String status, String keyword, int page, int limit);

    PageResponseOffset<RequestBusinessResponse> getRequestBusinessesByOffset(String status, String keyword, int page, int limit);

    int getTotalPendingRequest();

    int getPendingStudentRequest();

    int getPendingBusinessRequest();
}
