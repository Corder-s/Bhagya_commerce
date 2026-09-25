package com.bhagya.commerce.catalog.category.repository;

import com.bhagya.commerce.catalog.category.domain.Category;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class CategoryRepository {

    private final Map<String, Category> categoryStorage = new ConcurrentHashMap<>();
    private final Map<String, String> slugIndex = new ConcurrentHashMap<>();

    public CategoryRepository() {
        seed("cat_01", "handloom-textiles", "Handloom & Textiles", "Pure silks, khadi, and hand-woven fabrics", "soft-green", "/images/categories/textiles.jpg");
        seed("cat_02", "brassware-metalcraft", "Brassware & Metalcraft", "Temple bells, idols, and hand-cast virgin brass", "sand", "/images/categories/brass.jpg");
        seed("cat_03", "ayurveda-wellness", "Ayurveda & Wellness", "Herbal formulations, raw grains, and organic botanicals", "canvas", "/images/categories/ayurveda.jpg");
        seed("cat_04", "terracotta-pottery", "Terracotta & Pottery", "Blue pottery, clay cookware, and earthen decor", "deep", "/images/categories/pottery.jpg");
    }

    private void seed(String id, String slug, String name, String descriptor, String tone, String image) {
        Category cat = new Category(id, slug, name, descriptor, tone, image);
        save(cat);
    }

    public List<Category> findAll() {
        return new ArrayList<>(categoryStorage.values());
    }

    public Optional<Category> findById(String id) {
        return Optional.ofNullable(categoryStorage.get(id));
    }

    public Optional<Category> findBySlug(String slug) {
        String id = slugIndex.get(slug);
        return id != null ? Optional.ofNullable(categoryStorage.get(id)) : Optional.empty();
    }

    public Category save(Category category) {
        if (category.getId() == null) {
            category.setId("cat_" + System.currentTimeMillis());
        }
        categoryStorage.put(category.getId(), category);
        if (category.getSlug() != null) {
            slugIndex.put(category.getSlug(), category.getId());
        }
        return category;
    }
}
