package com.bhagya.commerce.catalog.category.domain;

import java.time.Instant;

public class Category {
    private String id;
    private String slug;
    private String name;
    private String descriptor;
    private String tone;
    private String imageUrl;
    private Instant createdAt;

    public Category() {}

    public Category(String id, String slug, String name, String descriptor, String tone, String imageUrl) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.descriptor = descriptor;
        this.tone = tone;
        this.imageUrl = imageUrl;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescriptor() { return descriptor; }
    public void setDescriptor(String descriptor) { this.descriptor = descriptor; }

    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
