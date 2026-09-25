package com.bhagya.commerce.store.repository;

import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.domain.StoreStatus;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class StoreRepository {

    private final Map<String, Store> storeStorage = new ConcurrentHashMap<>();
    private final Map<String, String> slugIndex = new ConcurrentHashMap<>();

    public StoreRepository() {
        Store defaultStore = new Store(
            "store_varanasi_silk",
            "org_varanasi_heritage",
            "Varanasi Heritage Silks",
            "varanasi-heritage-silks",
            "Handloom & Textiles"
        );
        defaultStore.setStory("Fourth-generation master handloom weavers preserving pure mulberry silk traditions.");
        defaultStore.setLogoUrl("/images/stores/varanasi.jpg");
        defaultStore.setStatus(StoreStatus.ACTIVE);
        defaultStore.setContactEmail("contact@varanasiheritage.in");
        defaultStore.setContactPhone("+919876543211");
        save(defaultStore);
    }

    public Optional<Store> findById(String id) {
        return Optional.ofNullable(storeStorage.get(id));
    }

    public Optional<Store> findBySlug(String slug) {
        String id = slugIndex.get(slug);
        return id != null ? Optional.ofNullable(storeStorage.get(id)) : Optional.empty();
    }

    public Store save(Store store) {
        if (store.getId() == null) {
            store.setId("store_" + System.currentTimeMillis());
        }
        storeStorage.put(store.getId(), store);
        if (store.getSlug() != null) {
            slugIndex.put(store.getSlug(), store.getId());
        }
        return store;
    }

    public boolean existsBySlug(String slug) {
        return slugIndex.containsKey(slug);
    }
}
