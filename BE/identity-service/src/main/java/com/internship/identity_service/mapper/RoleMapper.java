package com.internship.identity_service.mapper;

import com.internship.identity_service.model.Role;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface RoleMapper {
    List<Role> findAll();

    Optional<Role> findById(int roleId);

    void create(Role role);

    void update(Role role);

    void delete(int roleId);

    Role findByName(String roleName);

}
