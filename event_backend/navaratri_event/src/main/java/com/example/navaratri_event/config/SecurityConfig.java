
package com.example.navaratri_event.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // Disable CSRF for REST APIs
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors -> {})

            // Authorization
            .authorizeHttpRequests(auth -> auth

                // Login and Register - PUBLIC
                .requestMatchers(
                    "/users/login",
                    "/users/register"
                ).permitAll()

                // Events - PUBLIC
                .requestMatchers(
                    "/events/**"
                ).permitAll()

                // Packages - PUBLIC
                .requestMatchers(
                    "/packages/**"
                ).permitAll()

                // Bookings - PUBLIC
                .requestMatchers(
                    "/bookings/**"
                ).permitAll()

                // Users - PUBLIC for now
                .requestMatchers(
                    "/users/**"
                ).permitAll()

                // Everything else - PUBLIC
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}