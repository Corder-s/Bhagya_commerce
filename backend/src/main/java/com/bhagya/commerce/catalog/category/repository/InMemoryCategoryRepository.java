package com.bhagya.commerce.catalog.category.repository;

import org.springframework.stereotype.Repository;

@Repository
public class InMemoryCategoryRepository extends CategoryRepository {
    public InMemoryCategoryRepository() {
        super();
    }
}
