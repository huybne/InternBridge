package com.a2m.profileservice.dto.Paging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageResult<T> {
    private List<T> items;
    private int offset;
    private int totalCount;
    private int totalPages;
    private int limit;
}
