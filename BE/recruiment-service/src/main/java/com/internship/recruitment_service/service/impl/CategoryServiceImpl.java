package com.internship.recruitment_service.service.impl;

import com.internship.recruitment_service.dto.CategoryResponse.CategoryResponse;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.exception.AppException;
import com.internship.recruitment_service.exception.ErrorCode;
import com.internship.recruitment_service.mapper.CategoryMapper;
import com.internship.recruitment_service.model.Categories;
import com.internship.recruitment_service.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private CategoryMapper categoryMapper;


    @Override
    public Categories getCategoryById(Integer categoryId) {
        Categories categories = categoryMapper.getCategoryById(categoryId);
        if (categories == null) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return categories;
    }

    @Override
    public PaginatedResponse<Categories> getAllCategoriesWithPagination(int offset, int limit) {
        List<Categories> categories = categoryMapper.getAllCategoriesWithPagination(offset, limit);
        if (categories == null || categories.isEmpty()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        int total = categoryMapper.countAllCategories();
        int currentPage = offset / limit + 1;
        int totalPages = (int) Math.ceil((double) total / limit);

        return PaginatedResponse.<Categories>builder()
                .data(categories)
                .totalRecords(total)
                .currentPage(currentPage)
                .pageSize(limit)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public List<Categories> getAllCategories() {
        List<Categories> categories = categoryMapper.getAllCategories();
        if (categories == null || categories.isEmpty()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return categories;
    }

    @Override
    public List<Categories> getAllCategoriesPublic() {
        var list = categoryMapper.getAllCategoriesPublic();
        if (list == null || list.isEmpty()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return list;
    }

    @Override
    public Categories createCategory(Categories category) {
        if (categoryMapper.getCategoryById(category.getCategoryId()) != null) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        if (category.getCreatedAt() == null) {
            category.setCreatedAt(java.time.LocalDateTime.now());
        }
        categoryMapper.createCategory(category);
        return category;
    }

    @Override
    public Categories updateCategory(Categories category) {
        Categories existingCategory = categoryMapper.getCategoryById(category.getCategoryId());
        if (existingCategory == null) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        if (category.getUpdatedAt() == null) {
            category.setUpdatedAt(java.time.LocalDateTime.now());
        }

        categoryMapper.updateCategory(category);
        return category;
    }

    @Override
    public void deleteCategory(Integer categoryId) {
        Categories existingCategory = categoryMapper.getCategoryById(categoryId);
        if (existingCategory == null) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.deleteCategory(existingCategory.getCategoryId());
    }

    @Override
    public void restoreCategory(Integer categoryId) {
        Categories existingCategory = categoryMapper.getCategoryById(categoryId);
        if (existingCategory == null) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.restoreCategory(existingCategory.getCategoryId());
    }

    @Override
    public List<CategoryResponse> getCategoriesByJobid(String jobid) {
        var listcate = categoryMapper.getCategoriesByJobid(jobid);
        List<CategoryResponse> categories = new ArrayList<>();
        categories = listcate.stream().map(ct -> CategoryResponse.builder().label(ct.getName()).value(ct.getCategoryId()).build()).toList();
        return categories;
    }
}
