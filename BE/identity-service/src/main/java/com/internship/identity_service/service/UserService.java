package com.internship.identity_service.service;

import com.internship.identity_service.dto.PaginatedResponse;
import com.internship.identity_service.dto.request.ChangePasswordRequest;
import com.internship.identity_service.dto.request.RegisterRequest;
import com.internship.identity_service.dto.request.UserCreateRequest;
import com.internship.identity_service.dto.request.UserUpdateRequest;
import com.internship.identity_service.dto.response.MyInfoResponse;
import com.internship.identity_service.dto.response.SearchUserResponse;
import com.internship.identity_service.dto.response.UserReportResponse;
import com.internship.identity_service.dto.response.UserStatResponse;
import com.internship.identity_service.model.User;

import java.util.List;

public interface UserService {

    User findById(String id);


    void createUser(UserCreateRequest request);


    void updateUser(UserUpdateRequest request);

    void deleteUser(String id);

    List<User> getAll();

    List<User> getAllIncludingDeleted();

    void registerUser(RegisterRequest request);

    MyInfoResponse getMyInfo();

    void addRoleToUser(String userId, String roleName);


    PaginatedResponse<User> getUsersByRole(String roleName, int page, int size);

    void banStaffAdmin(String userId);

    void unbanStaffAdmin(String userId);

    UserStatResponse getUserStats();

    void removeRoleFromUser(String userId, String roleName);

    List<SearchUserResponse> searchUsersByEmail(String email);

    UserReportResponse getUserRegistrationReport();

    void updateAvatarPicture(String userId, String avatarUrl);
}
