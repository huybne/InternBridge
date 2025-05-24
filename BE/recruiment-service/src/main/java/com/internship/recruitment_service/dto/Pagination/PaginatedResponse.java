package com.internship.recruitment_service.dto.Pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginatedResponse<T> {
    private List<T> data;
    private int totalRecords;
    private int currentPage;
    private int pageSize;
    private int totalPages;
}
