package com.bhagya.commerce.auth.domain;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUser implements UserDetails {
    private final String id;
    private final String username;
    private final String storeId;
    private final Collection<? extends GrantedAuthority> authorities;

    public SecurityUser(String id, String username, String storeId, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.storeId = storeId;
        this.authorities = authorities != null ? authorities : List.of();
    }

    public String getId() { return id; }
    public String getStoreId() { return storeId; }
    public String getEmail() { return username != null ? username : id; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return ""; }
    @Override
    public String getUsername() { return username != null ? username : id; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
