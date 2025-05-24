package com.internship.identity_service.controller;

import com.internship.identity_service.dto.ApiResponse;
import com.internship.identity_service.dto.PaginatedResponse;
import com.internship.identity_service.dto.request.ChangePasswordRequest;
import com.internship.identity_service.dto.request.RemoveRoleRequest;
import com.internship.identity_service.dto.request.UserCreateRequest;
import com.internship.identity_service.dto.request.UserUpdateRequest;
import com.internship.identity_service.dto.response.*;
import com.internship.identity_service.model.User;
import com.internship.identity_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
        User user = userService.findById(id);
        ApiResponse<User> response = ApiResponse.<User>builder()
                .code(1000)
                .message("User found")
                .data(user)
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAll() {
        List<User> users = userService.getAll();
        ApiResponse<List<User>> response = ApiResponse.<List<User>>builder()
                .code(1000)
                .message("Users found")
                .data(users)
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<User>>> getAllIncludingDeleted() {
        List<User> users = userService.getAllIncludingDeleted();
        ApiResponse<List<User>> response = ApiResponse.<List<User>>builder()
                .code(1000)
                .message("Users found")
                .data(users)
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/roles/{roleName}")
    public ResponseEntity<ApiResponse<PaginatedResponse<User>>> getAllByRoleName(  @PathVariable String roleName,
                                                                                   @RequestParam(defaultValue = "1") int page,
                                                                                   @RequestParam(defaultValue = "10") int size){
        PaginatedResponse<User> result = userService.getUsersByRole(roleName, page, size);
        ApiResponse<PaginatedResponse<User>> response = ApiResponse.<PaginatedResponse<User>>builder()
                .code(1000)
                .message("Get Users with role " + roleName + " successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);

    }


    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Object>> createUser(@Valid @RequestBody UserCreateRequest request) {
        userService.createUser(request); // Không trả về gì

        ApiResponse<Object> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("User has been created successfully.")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }


    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Object>> updateUser(@RequestBody UserUpdateRequest request) {
        userService.updateUser(request);

        ApiResponse<Object> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("User updated successfully")
                .data(null) // hoặc có thể bỏ nếu không cần trả
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        ApiResponse<Object> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("User deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/my-info")
    public ResponseEntity<ApiResponse<MyInfoResponse>> getMyInfo(){
        MyInfoResponse myInfo =  userService.getMyInfo();
        ApiResponse<MyInfoResponse> response = ApiResponse.<MyInfoResponse>builder()
                .code(1000)
                .message("My Info")
                .data(myInfo)
                .build();
        return ResponseEntity.ok(response);
    }
    @PostMapping("/{userId}/roles/student")
    public ResponseEntity<ApiResponse<Void>> addStudentRole(@PathVariable String userId) {
        userService.addRoleToUser(userId, "STUDENT");
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("Student role added")
                .build());
    }

    @PostMapping("/{userId}/roles/business")
    public ResponseEntity<ApiResponse<Void>> addBusinessRole(@PathVariable String userId) {
        userService.addRoleToUser(userId, "BUSINESS");
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("Business role added")
                .build());
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{userId}/roles/staff-admin")
    public ResponseEntity<ApiResponse<Void>> addStaffAdminRole(@PathVariable String userId) {
        userService.addRoleToUser(userId, "STAFF_ADMIN");
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("StaffAdmin role added")
                .build());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF_ADMIN')")
    @PutMapping("/{userId}/ban")
    public ResponseEntity<ApiResponse<Void>> banStaffAdmin(@PathVariable String userId) {
        userService.banStaffAdmin(userId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("StaffAdmin account has been banned")
                .build());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF_ADMIN')")
    @PutMapping("/{userId}/unban")
    public ResponseEntity<ApiResponse<Void>> unbanStaffAdmin(@PathVariable String userId) {
        userService.unbanStaffAdmin(userId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("StaffAdmin account has been unbanned")
                .build());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF_ADMIN')")
    @GetMapping("/stats/status")
    public ResponseEntity<ApiResponse<UserStatResponse>> getUserStatusStats() {
        UserStatResponse stats = userService.getUserStats();

        ApiResponse<UserStatResponse> response = ApiResponse.<UserStatResponse>builder()
                .code(1000)
                .message("User status statistics fetched successfully.")
                .data(stats)
                .build();

        return ResponseEntity.ok(response);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/roles/remove")
    public ResponseEntity<ApiResponse<Void>> removeRoleFromUser(@RequestBody RemoveRoleRequest request){
        userService.removeRoleFromUser(request.getUserId(), request.getRoleName());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("Role has been removed")
                .build());
    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<SearchUserResponse>>> searchUsersByEmail(
            @RequestParam String email) {
        List<SearchUserResponse> users = userService.searchUsersByEmail(email);
        return ResponseEntity.ok(ApiResponse.<List<SearchUserResponse>>builder()
                .code(1000)
                .message("Search successful")
                .data(users)
                .build());
    }
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF_ADMIN')")
    @GetMapping("/report")
    public ResponseEntity<ApiResponse<UserReportResponse>> getUserReport() {
        UserReportResponse data = userService.getUserRegistrationReport();
        return ResponseEntity.ok(ApiResponse.<UserReportResponse>builder()
                .code(1000)
                .message("Success")
                .data(data)
                .build());
    }
    @PutMapping("/picture/{id}")
    public ResponseEntity<ApiResponse<?>> updateAvatarPicture(
            @PathVariable String id,
            @RequestBody String avatarUrl) {
        userService.updateAvatarPicture(id, avatarUrl);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(1000)
                .message("Avatar updated in identity service")
                .build());
    }

}
