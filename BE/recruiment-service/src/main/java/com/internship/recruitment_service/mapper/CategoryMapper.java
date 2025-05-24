package com.internship.recruitment_service.mapper;

import com.internship.recruitment_service.model.Categories;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {

    Categories getCategoryById( Integer categoryId);
    List<Categories> getAllCategoriesWithPagination(
            @Param(value = "offset") int offset,
            @Param("limit") int limit
    );

    List<Categories> getAllCategories();

    //sang
    List<Categories> getAllCategoriesPublic();
    int createCategory(Categories category);
    int updateCategory(Categories category);
    void deleteCategory(Integer categoryId);
    void restoreCategory(Integer categoryId);

    int countAllCategories();

    List<Categories> getCategoriesByJobid(@Param("jobId") String jobId);
}
