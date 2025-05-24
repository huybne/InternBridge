package com.internship.identity_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReportResponse {
    private List<Map<String, Object>> last7Days;
    private List<Map<String, Object>> thisMonth;
    private List<Map<String, Object>> thisYear;
}
