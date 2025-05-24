package com.internship.identity_service.mapper;

import com.internship.identity_service.dto.response.SearchUserResponse;
import com.internship.identity_service.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Mapper
public interface UserMapper {
    Optional<User> findByEmail(@Param("email") String email);
    Optional<User> findById(@Param("userId") String userId);
    List<User> findAll();
    List<User> findAllIncludingDeleted();
    int insertUser(User user);
    int updateUser(User user);
    int softDeleteUser(@Param("userId") String userId);

    String findEmailById(String userId);
    boolean existsByEmailAndNotDeleted(@Param("email") String email);

    void updatePassword(@Param("userId") String userId,
                        @Param("newPassword") String newPassword);
    void insertUserRoles(@Param("userId") String userId, @Param("roleId") Integer roleId);
    void deleteUserRoles(@Param("userId") String userId);

    void insertUserRole(@Param("userId") String userId, @Param("roleId") Integer roleId);
    boolean existsUserRole(@Param("userId") String userId, @Param("roleId") Integer roleId);
    List<User> findAllByRoleName(@Param("roleName") String roleName,
                                 @Param("limit") int limit,
                                 @Param("offset") int offset);

    int countUsersByRoleName(@Param("roleName") String roleName);
    void banUser(@Param("userId") String userId);
    void unbanUser(@Param("userId") String userId);

    List<Map<String, Object>> countUsersByStatus();

    void deleteSpecificUserRole(@Param("userId") String userId, @Param("roleId") Integer roleId);

    List<SearchUserResponse> searchUsersByEmail(String email);

    List<Map<String, Object>> countRegistrationsLast7Days();
    List<Map<String, Object>> countRegistrationsThisMonth();
    List<Map<String, Object>> countRegistrationsThisYear();

    void updateAvatar(@Param("userId") String userId, @Param("avatarUrl") String avatarUrl);

}
