package com.internship.identity_service.service.impl;

import com.internship.identity_service.dto.request.RoleRequest;
import com.internship.identity_service.exception.AppException;
import com.internship.identity_service.exception.ErrorCode;
import com.internship.identity_service.mapper.RoleMapper;
import com.internship.identity_service.model.Role;
import com.internship.identity_service.service.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private RoleMapper mapper;

    @Override
    public void create(RoleRequest request) throws AppException {
        Role role = Role.builder()
                .roleName(request.getRoleName())
                .permissions(request.getPermissions())
                .build();
        mapper.create(role);
    }

    @Override
    public Role findById(Integer id) {
        return mapper.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_ID_NOT_FOUND, id));
    }

    @Override
    public List<Role> findAll() {
        List<Role> roles = mapper.findAll();
        if (roles == null || roles.isEmpty()) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        }
        return roles;
    }

    @Override
    public void update(Integer roleId, RoleRequest request) {
        Role existing = mapper.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_ID_NOT_FOUND, roleId));

        Role updatedRole = Role.builder()
                .roleId(roleId)
                .roleName(request.getRoleName())
                .permissions(request.getPermissions())
                .build();

        mapper.update(updatedRole);
    }

    @Override
    public void delete(Integer roleId) {
        Role role = mapper.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_ID_NOT_FOUND, roleId));

        mapper.delete(roleId);
    }
}
