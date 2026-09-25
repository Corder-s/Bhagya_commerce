package com.bhagya.commerce.inventory.repository;

import com.bhagya.commerce.inventory.domain.InventoryEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryJpaRepository extends JpaRepository<InventoryEntity, String> {
    Optional<InventoryEntity> findByProductId(String productId);
    Optional<InventoryEntity> findByProductIdAndVariantId(String productId, String variantId);
}
