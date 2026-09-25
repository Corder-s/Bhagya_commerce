package com.bhagya.commerce.catalog.category.service;

import com.bhagya.commerce.catalog.category.domain.Category;
import com.bhagya.commerce.catalog.category.dto.CategoryResponse;
import com.bhagya.commerce.catalog.category.repository.CategoryRepository;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    public CategoryResponse getCategoryById(String id) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toResponse(cat);
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category cat = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return toResponse(cat);
    }

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getSlug(),
            category.getName(),
            category.getDescriptor(),
            category.getTone(),
            category.getImageUrl()
        );
    }
}
