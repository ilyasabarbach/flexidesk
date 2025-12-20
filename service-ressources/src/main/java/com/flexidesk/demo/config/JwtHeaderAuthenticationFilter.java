package com.flexidesk.demo.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;


public class JwtHeaderAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String userId = request.getHeader("X-User-Id");
        String userRoles = request.getHeader("X-User-Roles");

        // --- MOUCHARD DE DEBUG ---
        System.out.println("🔍 [Ressources] Reçu requête pour: " + request.getRequestURI());
        System.out.println("   -> Header X-User-Id: " + userId);
        System.out.println("   -> Header X-User-Roles: " + userRoles);
        // -------------------------

        if (userId != null && userRoles != null) {
            List<GrantedAuthority> authorities =
                    Collections.singletonList(new SimpleGrantedAuthority(userRoles));

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    authorities
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);
            System.out.println("   ✅ Authentification forcée avec succès : " + userRoles);
        } else {
            System.out.println("   ⚠️ Aucune identité trouvée dans les headers (Requête Anonyme)");
        }

        filterChain.doFilter(request, response);
    }

}