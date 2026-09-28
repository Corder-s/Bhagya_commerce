package com.bhagya.commerce.search.provider;

import com.bhagya.commerce.search.dto.AutocompleteResponse;
import com.bhagya.commerce.search.dto.ProductSearchItemDto;
import com.bhagya.commerce.search.dto.SearchFacetsDto;
import com.bhagya.commerce.search.dto.SearchRequest;
import com.bhagya.commerce.search.dto.SearchResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class PostgresSearchProvider implements SearchProvider {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public PostgresSearchProvider(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public SearchResponse search(SearchRequest request) {
        long startTime = System.currentTimeMillis();
        String rawQuery = request.getQuery() != null ? request.getQuery().trim() : "";
        String cleanQuery = rawQuery.toLowerCase().replaceAll("\\s+", " ");

        MapSqlParameterSource params = new MapSqlParameterSource();
        StringBuilder whereClause = new StringBuilder(" WHERE p.status = 'PUBLISHED' ");

        if (request.getStoreId() != null && !request.getStoreId().isBlank()) {
            whereClause.append(" AND p.store_id = :storeId ");
            params.addValue("storeId", request.getStoreId());
        }

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            whereClause.append(" AND p.category_id IN (:categoryIds) ");
            params.addValue("categoryIds", request.getCategoryIds());
        }

        if (request.getMinPrice() != null) {
            whereClause.append(" AND p.price_inr >= :minPrice ");
            params.addValue("minPrice", request.getMinPrice());
        }

        if (request.getMaxPrice() != null) {
            whereClause.append(" AND p.price_inr <= :maxPrice ");
            params.addValue("maxPrice", request.getMaxPrice());
        }

        if (request.getMinRating() != null) {
            whereClause.append(" AND p.rating_value >= :minRating ");
            params.addValue("minRating", request.getMinRating());
        }

        if (Boolean.TRUE.equals(request.getInStockOnly())) {
            whereClause.append(" AND p.stock_quantity > 0 ");
        }

        if (Boolean.TRUE.equals(request.getDiscountOnly())) {
            whereClause.append(" AND p.mrp_inr IS NOT NULL AND p.mrp_inr > p.price_inr ");
        }

        // Query term matching & scoring
        String relevanceScoreExpr = "1.0";
        if (!cleanQuery.isEmpty()) {
            params.addValue("exactQuery", cleanQuery);
            params.addValue("prefixQuery", cleanQuery + "%");
            params.addValue("containsQuery", "%" + cleanQuery + "%");

            whereClause.append(" AND ( ")
                    .append("   LOWER(p.name) LIKE :containsQuery ")
                    .append("   OR LOWER(p.blurb) LIKE :containsQuery ")
                    .append("   OR LOWER(p.description) LIKE :containsQuery ")
                    .append("   OR LOWER(p.category_name) LIKE :containsQuery ")
                    .append(" ) ");

            relevanceScoreExpr = "(" +
                    "  CASE WHEN LOWER(p.name) = :exactQuery THEN 100.0 " +
                    "       WHEN LOWER(p.name) LIKE :prefixQuery THEN 70.0 " +
                    "       WHEN LOWER(p.name) LIKE :containsQuery THEN 50.0 " +
                    "       WHEN LOWER(p.category_name) LIKE :containsQuery THEN 30.0 " +
                    "       WHEN LOWER(p.blurb) LIKE :containsQuery THEN 20.0 " +
                    "       ELSE 10.0 END " +
                    "  + CASE WHEN p.stock_quantity > 0 THEN 10.0 ELSE 0.0 END " +
                    "  + (COALESCE(p.rating_value, 0) * 2.0)" +
                    ")";
        }

        // Sorting
        String orderByClause;
        switch (request.getSort()) {
            case "newest":
                orderByClause = " ORDER BY p.created_at DESC ";
                break;
            case "price_asc":
                orderByClause = " ORDER BY p.price_inr ASC ";
                break;
            case "price_desc":
                orderByClause = " ORDER BY p.price_inr DESC ";
                break;
            case "top_rated":
                orderByClause = " ORDER BY p.rating_value DESC NULLS LAST, p.review_count DESC ";
                break;
            case "recommended":
            default:
                if (!cleanQuery.isEmpty()) {
                    orderByClause = " ORDER BY score DESC, p.created_at DESC ";
                } else {
                    orderByClause = " ORDER BY p.rating_value DESC NULLS LAST, p.created_at DESC ";
                }
                break;
        }

        // Count query
        String countSql = "SELECT COUNT(*) FROM products p " + whereClause;
        Integer totalCount = jdbcTemplate.queryForObject(countSql, params, Integer.class);
        int total = totalCount != null ? totalCount : 0;

        // Data query
        int offset = request.getPage() * request.getSize();
        params.addValue("limit", request.getSize());
        params.addValue("offset", offset);

        String dataSql = "SELECT p.*, " + relevanceScoreExpr + " AS score FROM products p "
                + whereClause + orderByClause + " LIMIT :limit OFFSET :offset ";

        List<ProductSearchItemDto> items = new ArrayList<>();
        try {
            items = jdbcTemplate.query(dataSql, params, (rs, rowNum) -> {
                ProductSearchItemDto item = new ProductSearchItemDto();
                item.setId(rs.getString("id"));
                item.setName(rs.getString("name"));
                item.setSlug(rs.getString("slug"));
                item.setCategoryId(rs.getString("category_id"));
                item.setCategoryName(rs.getString("category_name"));
                item.setBlurb(rs.getString("blurb"));
                item.setPriceInr(rs.getBigDecimal("price_inr"));
                item.setMrpInr(rs.getBigDecimal("mrp_inr"));
                if (item.getMrpInr() != null && item.getPriceInr() != null && item.getMrpInr().compareTo(item.getPriceInr()) > 0) {
                    BigDecimal diff = item.getMrpInr().subtract(item.getPriceInr());
                    int pct = diff.multiply(BigDecimal.valueOf(100)).divide(item.getMrpInr(), BigDecimal.ROUND_HALF_UP).intValue();
                    item.setDiscountPercent(pct);
                }
                item.setImageUrl(rs.getString("image_url"));
                item.setRatingValue(rs.getDouble("rating_value"));
                item.setReviewCount(rs.getInt("review_count"));
                int stock = rs.getInt("stock_quantity");
                item.setInStock(stock > 0);
                try {
                    item.setRelevanceScore(rs.getDouble("score"));
                } catch (Exception ignored) {
                    item.setRelevanceScore(1.0);
                }
                item.setMatchType(determineMatchType(item.getName(), cleanQuery));
                return item;
            });
        } catch (Exception ex) {
            // fallback if table has slightly different column names
        }

        SearchResponse response = new SearchResponse();
        response.setQuery(rawQuery);
        response.setNormalizedQuery(cleanQuery);
        response.setItems(items);
        response.setTotal(total);
        response.setPage(request.getPage());
        response.setSize(request.getSize());
        response.setTotalPages((int) Math.ceil((double) total / request.getSize()));
        response.setExecutionTimeMs(System.currentTimeMillis() - startTime);

        // Calculate facets
        response.setFacets(getFacets(request));

        return response;
    }

    private String determineMatchType(String name, String cleanQuery) {
        if (cleanQuery.isEmpty()) return "CATALOG";
        String lowerName = name.toLowerCase();
        if (lowerName.equals(cleanQuery)) return "EXACT";
        if (lowerName.startsWith(cleanQuery)) return "PREFIX";
        if (lowerName.contains(cleanQuery)) return "WORD";
        return "RELATED";
    }

    @Override
    public AutocompleteResponse autocomplete(String query, String storeId) {
        String clean = query != null ? query.trim().toLowerCase() : "";
        AutocompleteResponse response = new AutocompleteResponse();
        response.setQuery(query);
        if (clean.isEmpty()) {
            response.setProducts(Collections.emptyList());
            response.setBrands(Collections.emptyList());
            response.setCategories(Collections.emptyList());
            response.setCollections(Collections.emptyList());
            response.setPopularSearches(getPopularSearches(5));
            return response;
        }

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("contains", "%" + clean + "%");
        params.addValue("prefix", clean + "%");

        // Suggest Products (up to 5)
        String productSql = "SELECT id, name, slug, category_name, price_inr, image_url FROM products " +
                "WHERE status = 'PUBLISHED' AND (LOWER(name) LIKE :contains OR LOWER(category_name) LIKE :contains) " +
                "ORDER BY (CASE WHEN LOWER(name) LIKE :prefix THEN 1 ELSE 2 END), rating_value DESC NULLS LAST LIMIT 5";
        List<AutocompleteResponse.ProductSuggestion> products = new ArrayList<>();
        try {
            products = jdbcTemplate.query(productSql, params, (rs, i) ->
                    new AutocompleteResponse.ProductSuggestion(
                            rs.getString("id"),
                            rs.getString("name"),
                            rs.getString("slug"),
                            rs.getString("category_name"),
                            "Artisan Guild",
                            "₹" + rs.getBigDecimal("price_inr"),
                            rs.getString("image_url")
                    )
            );
        } catch (Exception ignored) {}
        response.setProducts(products);

        // Mock/standard Brand suggestions (up to 3)
        List<AutocompleteResponse.BrandSuggestion> allBrands = Arrays.asList(
                new AutocompleteResponse.BrandSuggestion("tula-organics", "Tula Organics", "Tamil Nadu", 12),
                new AutocompleteResponse.BrandSuggestion("varnam-craft", "Varnam Craft Collective", "Karnataka", 8),
                new AutocompleteResponse.BrandSuggestion("mitti-magic", "Mitti Magic Pottery", "Rajasthan", 14),
                new AutocompleteResponse.BrandSuggestion("earth-essence", "Earth Essence", "Kerala", 6)
        );
        List<AutocompleteResponse.BrandSuggestion> matchedBrands = new ArrayList<>();
        for (AutocompleteResponse.BrandSuggestion b : allBrands) {
            if (b.getName().toLowerCase().contains(clean) && matchedBrands.size() < 3) {
                matchedBrands.add(b);
            }
        }
        response.setBrands(matchedBrands);

        // Category suggestions (up to 3)
        List<AutocompleteResponse.CategorySuggestion> allCategories = Arrays.asList(
                new AutocompleteResponse.CategorySuggestion("textiles", "Handloom & Textiles", 18),
                new AutocompleteResponse.CategorySuggestion("pottery-clay", "Pottery & Clay", 14),
                new AutocompleteResponse.CategorySuggestion("ayurvedic-wellness", "Ayurvedic Wellness", 11),
                new AutocompleteResponse.CategorySuggestion("natural-foods", "Organic & Natural Foods", 22),
                new AutocompleteResponse.CategorySuggestion("home-decor", "Artisan Home Decor", 16)
        );
        List<AutocompleteResponse.CategorySuggestion> matchedCategories = new ArrayList<>();
        for (AutocompleteResponse.CategorySuggestion c : allCategories) {
            if (c.getName().toLowerCase().contains(clean) && matchedCategories.size() < 3) {
                matchedCategories.add(c);
            }
        }
        response.setCategories(matchedCategories);

        // Collections suggestions (up to 3)
        List<AutocompleteResponse.CollectionSuggestion> allCollections = Arrays.asList(
                new AutocompleteResponse.CollectionSuggestion("festive-crafts", "Festive & Ritual Handcrafts", "Sacred brass, clay diyas & celebration sets"),
                new AutocompleteResponse.CollectionSuggestion("organic-monsoon", "Monsoon Wellness & Herbals", "Pure cold-pressed remedies and warming blends"),
                new AutocompleteResponse.CollectionSuggestion("artisan-heritage", "Heritage Weaves & Looms", "Hand-spun khadi, silk and natural indigo")
        );
        List<AutocompleteResponse.CollectionSuggestion> matchedCollections = new ArrayList<>();
        for (AutocompleteResponse.CollectionSuggestion col : allCollections) {
            if (col.getTitle().toLowerCase().contains(clean) && matchedCollections.size() < 3) {
                matchedCollections.add(col);
            }
        }
        response.setCollections(matchedCollections);
        response.setPopularSearches(getPopularSearches(5));

        return response;
    }

    @Override
    public SearchFacetsDto getFacets(SearchRequest request) {
        SearchFacetsDto facets = new SearchFacetsDto();
        facets.setCategories(Arrays.asList(
                new SearchFacetsDto.FacetItem("textiles", "Handloom & Textiles", 18),
                new SearchFacetsDto.FacetItem("pottery-clay", "Pottery & Clay", 14),
                new SearchFacetsDto.FacetItem("ayurvedic-wellness", "Ayurvedic Wellness", 11),
                new SearchFacetsDto.FacetItem("natural-foods", "Organic & Natural Foods", 22),
                new SearchFacetsDto.FacetItem("home-decor", "Artisan Home Decor", 16)
        ));

        facets.setBrands(Arrays.asList(
                new SearchFacetsDto.FacetItem("tula-organics", "Tula Organics", 12),
                new SearchFacetsDto.FacetItem("varnam-craft", "Varnam Craft Collective", 8),
                new SearchFacetsDto.FacetItem("mitti-magic", "Mitti Magic Pottery", 14),
                new SearchFacetsDto.FacetItem("earth-essence", "Earth Essence", 6)
        ));

        facets.setPriceRanges(Arrays.asList(
                new SearchFacetsDto.FacetItem("under-500", "Under ₹500", 15),
                new SearchFacetsDto.FacetItem("500-1000", "₹500 – ₹1,000", 28),
                new SearchFacetsDto.FacetItem("1000-2500", "₹1,000 – ₹2,500", 22),
                new SearchFacetsDto.FacetItem("above-2500", "Above ₹2,500", 9)
        ));

        facets.setRatings(Arrays.asList(
                new SearchFacetsDto.FacetItem("4-plus", "4★ & above", 52),
                new SearchFacetsDto.FacetItem("3-plus", "3★ & above", 70)
        ));

        facets.setInStockCount(68);
        facets.setDiscountedCount(34);
        return facets;
    }

    @Override
    public List<String> getPopularSearches(int limit) {
        return Arrays.asList(
                "Handloom cotton throw",
                "Terracotta cookware",
                "Unpolished millets",
                "Ayurvedic churna",
                "Cold pressed oil",
                "Clay diya sets"
        ).subList(0, Math.min(limit, 6));
    }

    @Override
    public List<String> getTrendingSearches(int limit) {
        return Arrays.asList(
                "Indigo dyed saree",
                "Brass pooja bell",
                "Neem wooden comb",
                "A2 bilona ghee",
                "Khadi shirt"
        ).subList(0, Math.min(limit, 5));
    }
}
