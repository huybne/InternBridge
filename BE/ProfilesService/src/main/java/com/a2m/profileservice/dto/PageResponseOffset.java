package com.a2m.profileservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class PageResponseOffset<T> {
    private List<T> items;
    private Integer page;
    private Integer limit;
    private Integer totalItems;
    private Integer totalPages;
    private Boolean hasMore;
}
