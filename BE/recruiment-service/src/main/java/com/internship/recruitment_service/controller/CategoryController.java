package com.internship.recruitment_service.controller;

import com.internship.recruitment_service.dto.ApiResponse;
import com.internship.recruitment_service.model.Categories;
import com.internship.recruitment_service.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private CategoryService categoryService;

    @GetMapping("/getAllCategories/pagination")
    public ResponseEntity<?> getAllCategoriesWithPagination(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "1") int limit
    ) {
        var api = categoryService.getAllCategoriesWithPagination(offset, limit);

        ApiResponse<?> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Categories found")
                .data(api)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAllCategories")
    public ResponseEntity<?> getAllCategories() {
        var api = categoryService.getAllCategories();

        ApiResponse<?> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Categories found")
                .data(api)
                .build();
        return ResponseEntity.ok(response);
    }

    //sang
    @GetMapping("/getAllCategoriespublic")
    public ResponseEntity<?> getAllCategoriesPublic() {
        var api = categoryService.getAllCategoriesPublic();

        ApiResponse<?> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Categories found")
                .data(api)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Categories>> getCategoryById(
            @PathVariable Integer id
    ) {
        Categories categories = categoryService.getCategoryById(id);
        ApiResponse<Categories> response = ApiResponse.<Categories>builder()
                .code(1000)
                .message("Category found")
                .data(categories)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Categories>> createCategory(
            @RequestBody Categories category
    ){
        Categories newCategory = categoryService.createCategory(category);
        ApiResponse<Categories> response = ApiResponse.<Categories>builder()
                .code(1000)
                .message("Category created successfully")
                .data(newCategory)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Categories>> updateCategory(
            @RequestBody Categories category
    ){
        Categories updatedCategory = categoryService.updateCategory(category);
        ApiResponse<Categories> response = ApiResponse.<Categories>builder()
                .code(1000)
                .message("Category updated successfully")
                .data(updatedCategory)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCategory(
            @PathVariable Integer id
    ){
        categoryService.deleteCategory(id);
        ApiResponse<Object> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Category deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<ApiResponse<Object>> restoreCategory(
            @PathVariable Integer id
    ){
        categoryService.restoreCategory(id);
        ApiResponse<Object> response = ApiResponse.<Object>builder()
                .code(1000)
                .message("Category restored successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
