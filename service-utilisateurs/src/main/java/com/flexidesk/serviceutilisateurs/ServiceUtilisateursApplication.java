package com.flexidesk.serviceutilisateurs;

import com.flexidesk.serviceutilisateurs.model.User;
import com.flexidesk.serviceutilisateurs.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ServiceUtilisateursApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceUtilisateursApplication.class, args);
	}


    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // On vérifie si l'utilisateur "admin" est déjà présent
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User(); // Utilisation du modèle User existant
                admin.setUsername("admin");

                // On hache le mot de passe avec le PasswordEncoder défini dans SecurityConfig
                admin.setPassword(passwordEncoder.encode("admin123"));

                // On définit le rôle d'administrateur
                admin.setRole("ROLE_ADMIN");

                // Sauvegarde en base de données
                userRepository.save(admin);

                System.out.println("--------------------------------------");
                System.out.println("INITIALISATION : Compte Admin créé");
                System.out.println("Utilisateur : admin");
                System.out.println("Mot de passe : admin123");
                System.out.println("--------------------------------------");
            } else {
                System.out.println("INITIALISATION : Le compte Admin existe déjà.");
            }
        };
    }
}
