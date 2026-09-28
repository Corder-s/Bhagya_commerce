package com.bhagya.commerce.loyalty.repository;

import com.bhagya.commerce.loyalty.domain.LoyaltyProgram;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class LoyaltyProgramRepository {

    private final Map<String, LoyaltyProgram> storeProgramStorage = new ConcurrentHashMap<>();

    public LoyaltyProgramRepository() {
        // Seed default program for standard stores
        LoyaltyProgram p1 = LoyaltyProgram.createDefault("store_main");
        storeProgramStorage.put("store_main", p1);

        LoyaltyProgram p2 = LoyaltyProgram.createDefault("store_varanasi_silk");
        p2.setProgramName("Banarasi Silk Weavers Club");
        storeProgramStorage.put("store_varanasi_silk", p2);
    }

    public Optional<LoyaltyProgram> findByStoreId(String storeId) {
        LoyaltyProgram p = storeProgramStorage.get(storeId);
        if (p == null) {
            // Lazily initialize default program for new store
            p = LoyaltyProgram.createDefault(storeId);
            storeProgramStorage.put(storeId, p);
        }
        return Optional.of(p);
    }

    public LoyaltyProgram save(LoyaltyProgram program) {
        storeProgramStorage.put(program.getStoreId(), program);
        return program;
    }
}
