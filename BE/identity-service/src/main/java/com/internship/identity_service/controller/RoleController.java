package com.internship.identity_service.controller;

import com.internship.identity_service.dto.ApiResponse;
import com.internship.identity_service.dto.request.RoleRequest;
import com.internship.identity_service.model.Role;
import com.internship.identity_service.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody RoleRequest request) {
        roleService.create(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Role created successfully")
                .build());
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Role>> findById(@PathVariable Integer id) {
        Role role = roleService.findById(id);
        return ResponseEntity.ok(ApiResponse.<Role>builder()
                .data(role)
                .message("Role found")
                .build());
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Role>>> findAll() {
        List<Role> roles = roleService.findAll();
        return ResponseEntity.ok(ApiResponse.<List<Role>>builder()
                .data(roles)
                .message("All roles")
                .build());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> update(@PathVariable Integer id, @RequestBody RoleRequest request) {
        roleService.update(id, request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Role updated successfully")
                .build());
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Role deleted successfully")
                .build());
    }
}
