package com.bhagya.commerce.common.security;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {

    private final String id;
    private final String phone;
    private final String email;
    private final String name;
    private final String storeId;
    private final String organizationId;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(
        String id,
        String phone,
        String email,
        String name,
        String storeId,
        String organizationId,
        String role
    ) {
        this.id = id;
        this.phone = phone;
        this.email = email;
        this.name = name;
        this.storeId = storeId;
        this.organizationId = organizationId;
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public String getId() { return id; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getStoreId() { return storeId; }
    public String getOrganizationId() { return organizationId; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return ""; }
    @Override
    public String getUsername() { return phone != null ? phone : id; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
