package com.a2m.profileservice.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RequestStatsMapper {
    int countTotalPendingRequests();
    int countPendingStudentRequests();
    int countPendingBusinessRequests();
}
