package com.a2m.profileservice.service.Impl;

import com.a2m.profileservice.dto.message.NotificationMessage;
import com.a2m.profileservice.dto.PageResponseOffset;
import com.a2m.profileservice.dto.request.UpdateRequestStatus;
import com.a2m.profileservice.dto.response.*;
import com.a2m.profileservice.exception.AppException;
import com.a2m.profileservice.exception.EntityNotFoundException;
import com.a2m.profileservice.exception.ErrorCode;
import com.a2m.profileservice.mapper.*;
import com.a2m.profileservice.model.BusinessProfiles;
import com.a2m.profileservice.model.RequestBusinesses;
import com.a2m.profileservice.model.RequestStudents;
import com.a2m.profileservice.model.student_profiles;
import com.a2m.profileservice.service.StaffAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffAdminServiceImpl implements StaffAdminService {
    private final RequestBusinessesMapper requestBusinessesMapper;
    private final RequestStudentMapper requestStudentMapper;
    private final BusinessProfilesMapper businessProfilesMapper;
    private final StudentProfilesMapper studentProfilesMapper;
    private final RequestStatsMapper requestStatsMapper;


    @Autowired
    private AmqpTemplate amqpTemplate;
    @Autowired
    private ImagesBusinessMapper imagesBusinessMapper;



    @Override
    public List<RequestBusinessResponse> getAllRequestBusinessesWithCompanyName() {
        List<RequestBusinesses> requests = requestBusinessesMapper.getAllRequestBusiness();
        return requests.stream()
                .map(request -> RequestBusinessResponse.builder()
                        .request(request)
                        .companyName(businessProfilesMapper.getCompanyNameById(request.getBusinessId()))
                        .build())
                .toList();
    }

    @Override
    public List<RequestBusinessResponse> getRequestBusinessesByStatus(String status) {
        validateStatus(status);

        List<RequestBusinesses> requestBusinessList = requestBusinessesMapper.getAllRequestBusinessByStatus(status);

        return requestBusinessList.stream()
                .map(request -> {
                    String companyName = businessProfilesMapper.getCompanyNameById(request.getBusinessId());
                    return RequestBusinessResponse.builder()
                            .request(request)
                            .companyName(companyName)
                            .build();
                })
                .toList();
    }



    @Override
    public List<RequestStudentResponse> getRequestStudentsByStatus(String status) {
        validateStatus(status);
        List<RequestStudents> requests = requestStudentMapper.getRequestStudentByStatus(status);

        return requests.stream()
                .map(request -> {
                    String studentName = studentProfilesMapper.getStudentName(request.getStudentId());
                    return RequestStudentResponse.builder()
                            .requestStudents(request)
                            .studentName(studentName)
                            .build();
                })
                .toList();
    }
    @Override
    public List<RequestStudentResponse> getAllRequestStudentsWithName() {
        List<RequestStudents> requests = requestStudentMapper.getAllRequestStudents();

        return requests.stream()
                .map(request -> {
                    String studentName = studentProfilesMapper.getStudentName(request.getStudentId());
                    return RequestStudentResponse.builder()
                            .requestStudents(request)
                            .studentName(studentName)
                            .build();
                })
                .toList();
    }


    @Override
    public RequestBusinessDetailResponse getRequestBusinessesById(String id) {
        RequestBusinesses requestBusinesses = requestBusinessesMapper.getRequestBusinessById(id);
        if(requestBusinesses == null || requestBusinesses.isDeleted()) {
            throw new EntityNotFoundException("Request business with ID " + id + " not found");

        }
        BusinessProfiles businessProfiles = businessProfilesMapper.getBusinessProfileById(requestBusinesses.getBusinessId());
        return RequestBusinessDetailResponse.builder()
                .request(requestBusinesses)
                .businessProfile(businessProfiles)
                .build();
    }
    @Override
    public RequestStudentDetailResponse getRequestStudentById(String id) {
        RequestStudents request = requestStudentMapper.getRequestStudentById(id);
        if(request == null || request.isDeleted()) {
            throw new EntityNotFoundException("Request business with ID " + id + " not found");

        }
        student_profiles studentProfile = studentProfilesMapper.getById(request.getStudentId());

        return RequestStudentDetailResponse.builder()
                .request(request)
                .studentProfiles(studentProfile)
                .build();
    }
    @Override
    public void updateRequestStudentStatus(UpdateRequestStatus request) {
        String status = request.getStatus().toLowerCase();
        if (!status.equals("approve") && !status.equals("reject")) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        RequestStudentDetailResponse detail = getRequestStudentById(request.getId());
        requestStudentMapper.updateRequestStudentStatus(request.getId(), status);
        if (status.equals("approve")) {
            studentProfilesMapper.approveStudentProfile(detail.getStudentProfiles().getProfileId(), true);
        }
        if (status.equals("reject")) {
            requestStudentMapper.updateRejectReason(request.getId(), request.getReason());
            studentProfilesMapper.approveStudentProfile(detail.getStudentProfiles().getProfileId(), false);

        }

        student_profiles student = detail.getStudentProfiles();
        String title;
        String message;
        String type;
        String url;

        if (status.equals("approve")) {
            title = "Your student account has been verified!";
            message = "You can now apply for internships and manage your profile.";
            type = "ACCOUNT_APPROVED";
            url = "/studentprofile";
        } else {
            title = "Your student account was NOT verified.";
            message = request.getReason() != null ? request.getReason() : "Your profile does not meet the verification requirements.";
            type = "ACCOUNT_REJECTED";
            url = "/";
        }

        sendNotification(student.getProfileId(), title, message, type, url);
    }



    @Override
    public void updateRequestBusinessStatus(UpdateRequestStatus request) {
        String status = request.getStatus().toLowerCase();
        if (!status.equals("approve") && !status.equals("reject")) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        RequestBusinessDetailResponse detail = getRequestBusinessesById(request.getId());
        requestBusinessesMapper.updateRequestBusinessStatus(request.getId(), status);

        if (status.equals("reject")) {
            requestBusinessesMapper.updateRejectReason(request.getId(), request.getReason());
        }

        BusinessProfiles business = detail.getBusinessProfile();

        String title;
        String message;
        String type;
        String url;

        if (status.equals("approve")) {
            title = "Your business account has been verified!";
            message = "You can now post internships and manage your company profile.";
            type = "ACCOUNT_APPROVED";
            url = "/businessprofile";
        } else {
            title = "Your business account was NOT verified.";
            message = request.getReason() != null ? request.getReason() : "Your profile does not meet the verification requirements.";
            type = "ACCOUNT_REJECTED";
            url = "/";
        }

        sendNotification(business.getProfileId(), title, message, type, url);
    }



    //cursor pagination

    @Override
    public PageResponseOffset<RequestStudentResponse> getRequestStudentsByOffset(String status, String keyword, int page, int limit) {
        int offset = Math.max(0, page * limit);

        List<RequestStudents> raw = requestStudentMapper.getRequestStudentsByOffset(status, keyword, limit, offset);

        List<RequestStudentResponse> items = raw.stream()
                .map(request -> RequestStudentResponse.builder()
                        .requestStudents(request)
                        .studentName(studentProfilesMapper.getStudentName(request.getStudentId()))
                        .avatar(requestStudentMapper.getAvatarByStudentId(request.getStudentId()))
                        .uni(requestStudentMapper.getUniversityByStudentId(request.getStudentId()))
                        .build())
                .toList();


        int totalItems = requestStudentMapper.countRequestStudents(status, keyword);
        int totalPages = (int) Math.ceil((double) totalItems / limit);
        boolean hasMore = page < totalPages;

        return PageResponseOffset.<RequestStudentResponse>builder()
                .items(items)
                .page(page)
                .limit(limit)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .hasMore(hasMore)
                .build();
    }



    @Override
    public PageResponseOffset<RequestBusinessResponse> getRequestBusinessesByOffset(String status, String keyword, int page, int limit) {
        int offset = Math.max(0, page * limit);

        List<RequestBusinesses> raw = requestBusinessesMapper.getRequestBusinessByOffset(status, keyword, limit, offset);

        List<RequestBusinessResponse> items = raw.stream()
                .map(request -> RequestBusinessResponse.builder()
                        .request(request)
                        .companyName(businessProfilesMapper.getCompanyNameById(request.getBusinessId()))
                        .logoUrl(String.valueOf(imagesBusinessMapper.getFirstImageBusinessByBusinessId(request.getBusinessId())))
                        .industry(requestBusinessesMapper.getIndustryById(request.getBusinessId()))
                        .build())
                .toList();

        int totalItems = requestBusinessesMapper.countRequestBusiness(status, keyword);
        int totalPages = (int) Math.ceil((double) totalItems / limit);
        boolean hasMore = page < totalPages;

        return PageResponseOffset.<RequestBusinessResponse>builder()
                .items(items)
                .page(page)
                .limit(limit)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .hasMore(hasMore)
                .build();
    }



    //help
    private void validateStatus(String status) {
        if (!List.of("pending", "approve", "reject").contains(status.toLowerCase())) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
    }

    @Override
    public int getTotalPendingRequest(){
            return requestStatsMapper.countTotalPendingRequests();
    }
    @Override
    public int getPendingStudentRequest(){
        return requestStatsMapper.countPendingStudentRequests();
    }
    @Override
    public int getPendingBusinessRequest(){
        return requestStatsMapper.countPendingBusinessRequests();
    }


    //helper
    private void sendNotification(String userId, String title, String content, String type, String link) {
        NotificationMessage msg = new NotificationMessage(
                userId,
                title,
                content,
                type,
                link
        );
        amqpTemplate.convertAndSend("notification.exchange", "notify.account." + type.toLowerCase(), msg);
    }

}
