package com.flexidesk.serviceutilisateurs.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "utilisateurs") // "user" est souvent un mot-clé réservé en SQL
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // Le login (ex: email)

    @Column(nullable = false)
    private String password; // Le mot de passe HACHÉ

    private String role; // Ex: "ROLE_USER", "ROLE_ADMIN"

    // --- Méthodes de l'interface UserDetails ---
    // C'est grâce à elles que Spring Security fonctionnera

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    // On met 'true' pour l'instant.
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}