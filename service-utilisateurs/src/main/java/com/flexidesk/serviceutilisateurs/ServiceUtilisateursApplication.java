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
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
            }
        };
    }
}
