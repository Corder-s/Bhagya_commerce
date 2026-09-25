package com.bhagya.commerce.user.repository;

import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.domain.UserRole;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

/**
 * UserRepository interface & development adapter.
 * Structured for direct migration to Spring Data JPA / PostgreSQL in Step 12.
 */
@Repository
public class UserRepository {

    private final Map<String, User> userStorage = new ConcurrentHashMap<>();
    private final Map<String, String> phoneIndex = new ConcurrentHashMap<>();

    public UserRepository() {
        // Seed default development user accounts
        User customer = new User("usr_dev_customer_01", "+919876543210", "priya.sharma@example.com", "Priya Sharma", UserRole.CUSTOMER);
        save(customer);

        User merchant = new User("usr_dev_merchant_01", "+919876543211", "ananya.silk@example.com", "Ananya Verma", UserRole.STORE_OWNER);
        merchant.setStoreId("store_varanasi_silk");
        merchant.setOrganizationId("org_varanasi_heritage");
        save(merchant);
    }

    public Optional<User> findById(String id) {
        return Optional.ofNullable(userStorage.get(id));
    }

    public Optional<User> findByPhone(String phone) {
        String id = phoneIndex.get(phone);
        return id != null ? Optional.ofNullable(userStorage.get(id)) : Optional.empty();
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId("usr_" + System.currentTimeMillis());
        }
        userStorage.put(user.getId(), user);
        if (user.getPhone() != null) {
            phoneIndex.put(user.getPhone(), user.getId());
        }
        return user;
    }

    public boolean existsByPhone(String phone) {
        return phoneIndex.containsKey(phone);
    }
}
