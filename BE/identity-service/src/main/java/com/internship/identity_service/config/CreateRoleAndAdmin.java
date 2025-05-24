package com.internship.identity_service.config;

import com.internship.identity_service.mapper.RoleMapper;
import com.internship.identity_service.mapper.UserMapper;
import com.internship.identity_service.model.Role;
import com.internship.identity_service.model.Status;
import com.internship.identity_service.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CreateRoleAndAdmin implements CommandLineRunner {

    private final RoleMapper roleMapper;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultRoles();
        createDefaultAdmin();
    }

    private void createDefaultRoles() {
        Map<String, String> rolePermissions = Map.of(
                "ADMIN", "ALL",
                "USER", "READ_JOB,CREATE_PROFILE",
                "STUDENT", "VIEW_JOBS,APPLY_JOB,EDIT_PROFILE",
                "BUSINESS", "CREATE_JOB,VIEW_APPLICANTS,EDIT_PROFILE",
                "STAFF_ADMIN", "MANAGE_CENTERS,MANAGE_STUDENTS,VIEW_REPORT"
        );

        rolePermissions.forEach((roleName, permission) -> {
            Role existing = roleMapper.findByName(roleName);
            if (existing == null) {
                Role newRole = Role.builder()
                        .roleName(roleName)
                        .permissions(permission)
                        .createdAt(LocalDateTime.now())
                        .build();
                roleMapper.create(newRole);
                System.out.println("✅ Created role: " + roleName);
            } else {
                System.out.println("ℹ️ Role already exists: " + roleName);
            }
        });
    }

    private void createDefaultAdmin() {
        String adminEmail = "huybuinee@gmail.com";
        String adminUsername = "admin";
        String adminPassword = "admin";


        if (userMapper.findByEmail(adminEmail).isEmpty()) {
            Role adminRole = roleMapper.findByName("ADMIN");
            if (adminRole == null) {
                System.err.println("ADMIN role is missing.");
                return;
            }

            User adminUser = User.builder()
                    .userId(UUID.randomUUID().toString())
                    .email(adminEmail)
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .roles(Set.of(adminRole))
                    .createdAt(LocalDateTime.now())
                    .status(Status.active)
                    .isDeleted(false)
                    .provider("local")
                    .build();

            userMapper.insertUser(adminUser);
            userMapper.insertUserRole(adminUser.getUserId(), adminRole.getRoleId());


            System.out.println("Created admin user: " + adminEmail);
        } else {
            System.out.println("ℹAdmin user already exists: " + adminEmail);
        }
    }
}
