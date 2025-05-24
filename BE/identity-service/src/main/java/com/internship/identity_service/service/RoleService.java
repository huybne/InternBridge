package com.internship.identity_service.service;

import com.internship.identity_service.dto.request.RoleRequest;
import com.internship.identity_service.exception.AppException;
import com.internship.identity_service.model.Role;

import java.util.List;

public interface RoleService {
    void create(RoleRequest request) throws AppException;

    Role findById(Integer id);

    List<Role> findAll();

    void update(Integer roleId, RoleRequest request);

    void delete(Integer roleId);
}
