package com.a2m.profileservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PageResponse<T> {
    private List<T> items;
    private String nextCursor;
    private boolean hasMore;
}
