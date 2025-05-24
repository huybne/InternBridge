package com.internship.recruitment_service.service;

import com.internship.recruitment_service.dto.CategoryResponse.CategoryResponse;
import com.internship.recruitment_service.dto.Pagination.PaginatedResponse;
import com.internship.recruitment_service.model.Categories;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    Categories getCategoryById(Integer id);

    PaginatedResponse<Categories> getAllCategoriesWithPagination(int offset, int limit);
    List<Categories> getAllCategories();
    //sang
    List<Categories> getAllCategoriesPublic();
    Categories createCategory(Categories category);

    Categories updateCategory(Categories category);

    void deleteCategory(Integer id);
    void restoreCategory(Integer id);

    List<CategoryResponse> getCategoriesByJobid(String jobid);

}
