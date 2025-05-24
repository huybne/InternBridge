package com.internship.identity_service.service.impl;

import com.internship.identity_service.dto.PaginatedResponse;
import com.internship.identity_service.dto.request.RegisterRequest;
import com.internship.identity_service.dto.request.UserCreateRequest;
import com.internship.identity_service.dto.request.UserUpdateRequest;
import com.internship.identity_service.dto.response.MyInfoResponse;
import com.internship.identity_service.dto.response.SearchUserResponse;
import com.internship.identity_service.dto.response.UserReportResponse;
import com.internship.identity_service.dto.response.UserStatResponse;
import com.internship.identity_service.exception.ErrorCode;
import com.internship.identity_service.exception.AppException;
import com.internship.identity_service.mapper.RoleMapper;
import com.internship.identity_service.mapper.UserMapper;
import com.internship.identity_service.model.Role;
import com.internship.identity_service.model.Status;
import com.internship.identity_service.model.User;
import com.internship.identity_service.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserMapper userMapper;
    private RoleMapper roleMapper;
    @Override
    public User findById(String id) {
        return userMapper.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_ID_NOT_FOUND, id));
    }

    @Override
    public void createUser(UserCreateRequest request) {
        if (userMapper.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = new User();

        user.setUserId(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());

        user.setProvider("local");
        Role defaultRole = new Role();
        defaultRole.setRoleId(2);

        user.setStatus(request.getStatus());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userMapper.insertUser(user);

    }

    @Override
    public void updateUser(UserUpdateRequest request) {
        User existingUser = userMapper.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, request.getUserId()));

        existingUser.setUsername(request.getUsername());
        existingUser.setStatus(request.getStatus());
        existingUser.setEmail(request.getEmail());

        userMapper.updateUser(existingUser);
        userMapper.deleteUserRoles(existingUser.getUserId());
        userMapper.insertUserRoles(existingUser.getUserId(), request.getRoleId());
    }


    @Override
    public void deleteUser(String id) {
        User existingUser = userMapper.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND,id));

        
        existingUser.setStatus(Status.inactive);
        userMapper.softDeleteUser(id);
    }
    @Override
    public List<User> getAll() {
        List<User> allUsers = userMapper.findAll(); // lấy tất cả
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdminOrStaffAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("STAFF_ADMIN"));

        if (!isAdminOrStaffAdmin) {
            return allUsers.stream()
                    .filter(u -> !u.getStatus().equals(Status.banned))
                    .toList();
        }
        return allUsers;
    }

    @Override
    public List<User> getAllIncludingDeleted() {
        try {
            return userMapper.findAllIncludingDeleted(); // Không có user sẽ trả về empty list, là hợp lệ
        } catch (Exception e) {
            throw new AppException(ErrorCode.INTERNAL_ERROR, e); // Hoặc log thêm chi tiết
        }
    }

    @Override
    public void registerUser(RegisterRequest request){
        if (userMapper.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setProvider("local");
//        Set<Role> roles = new HashSet<>();
        Role defaultRole = new Role();
        defaultRole.setRoleId(2);
        user.setStatus(Status.active);
        user.setDeleted(false);

        userMapper.insertUser(user);
        userMapper.insertUserRole(user.getUserId(), 2);
    }

    @Override
    public MyInfoResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userMapper.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND,name));
        return MyInfoResponse.builder()
                .id(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roleNames(user.getRoles()
                        .stream()
                        .map(Role::getRoleName)
                        .toList())
                .avatar(user.getPicture())
                .build();

    }

    @Override
    public void addRoleToUser(String userId, String roleName) {
        Role role = roleMapper.findByName(roleName);
        if (role == null) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND, roleName);
        }


        boolean exists = userMapper.existsUserRole(userId, role.getRoleId());
        if (!exists) {
            userMapper.insertUserRole(userId, role.getRoleId());
        }
    }

    @Override
    public PaginatedResponse<User> getUsersByRole(String roleName, int page, int size) {
        int offset = page * size;

        Role role = roleMapper.findByName(roleName);
        if (role == null) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND, roleName);
        }
        List<User> users = userMapper.findAllByRoleName(roleName, size, offset);
        int total = userMapper.countUsersByRoleName(roleName);
        return new PaginatedResponse<>(users, total);

    }

    @Override
    public void banStaffAdmin(String userId) {
        var user = userMapper.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, userId));

        userMapper.banUser(userId);
    }

    @Override
    public void unbanStaffAdmin(String userId) {
        var user = userMapper.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, userId));

        userMapper.unbanUser(userId);
    }

    @Override
    public UserStatResponse getUserStats() {
        List<Map<String, Object>> raw = userMapper.countUsersByStatus();
        UserStatResponse res = new UserStatResponse();
        int total = 0;

        for (Map<String, Object> row : raw) {
            String status = (String) row.get("status");
            int count = ((Number) row.get("count")).intValue();
            total += count;
            switch (status) {
                case "active" -> res.setActive(count);
                case "inactive" -> res.setInactive(count);
                case "banned" -> res.setBanned(count);
            }
        }
        res.setTotal(total);
        return res;
    }

    @Override
    public void removeRoleFromUser(String userId, String roleName) {
        Role role = roleMapper.findByName(roleName);
        if (role == null) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND, roleName);
        }

        Optional<User> userOptional = userMapper.findById(userId);
        if (userOptional.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND, userId);
        }

        User user = userOptional.get();

        boolean hasRole = user.getRoles().stream()
                .anyMatch(r -> r.getRoleId().equals(role.getRoleId()));

        if (!hasRole) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND, "User does not have role: " + roleName);
        }

        userMapper.deleteSpecificUserRole(userId, role.getRoleId());
    }
    @Override
    public List<SearchUserResponse> searchUsersByEmail(String email) {
        return userMapper.searchUsersByEmail(email);
    }

    @Override
    public UserReportResponse getUserRegistrationReport() {
        return UserReportResponse.builder()
                .last7Days(userMapper.countRegistrationsLast7Days())
                .thisMonth(userMapper.countRegistrationsThisMonth())
                .thisYear(userMapper.countRegistrationsThisYear())
                .build();
    }
    @Override
    public void updateAvatarPicture(String userId, String avatarUrl) {
        userMapper.updateAvatar(userId, avatarUrl);
    }

}
