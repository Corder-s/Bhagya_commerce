package com.bhagya.commerce.common.api;

import java.util.List;

/**
 * Standard Paginated Response Model
 */
public record PageResponse<T>(
    List<T> items,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean hasNext
) {
    public static <T> PageResponse<T> of(List<T> items, int page, int size, long totalElements) {
        int totalPages = size == 0 ? 1 : (int) Math.ceil((double) totalElements / (double) size);
        boolean hasNext = page + 1 < totalPages;
        return new PageResponse<>(items, page, size, totalElements, totalPages, hasNext);
    }
}
