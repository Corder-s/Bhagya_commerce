package com.bhagya.commerce.catalog.category.controller;

import com.bhagya.commerce.catalog.category.dto.CategoryResponse;
import com.bhagya.commerce.catalog.category.service.CategoryService;
import com.bhagya.commerce.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Categories", description = "Public Craft Categories Discovery")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "List all artisanal categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @GetMapping("/{idOrSlug}")
    @Operation(summary = "Get category details by ID or slug")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategory(@PathVariable String idOrSlug) {
        CategoryResponse category;
        if (idOrSlug.startsWith("cat_")) {
            category = categoryService.getCategoryById(idOrSlug);
        } else {
            category = categoryService.getCategoryBySlug(idOrSlug);
        }
        return ResponseEntity.ok(ApiResponse.ok(category));
    }
}
