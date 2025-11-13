package com.farmatodo.reto.config;

import com.farmatodo.reto.security.ApiKeyFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final ApiKeyFilter apiKeyFilter;

    public SecurityConfig(ApiKeyFilter apiKeyFilter) {
        this.apiKeyFilter = apiKeyFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🔴 IMPORTANTE: desactivar CSRF para API stateless
                .csrf(AbstractHttpConfigurer::disable)

                // CORS (ya lo tienes, pero dejo uno completo)
                .cors(Customizer.withDefaults())

                // Sin sesión de servidor, tipo API
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Add API Key filter before authentication
                .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(auth -> auth
                        // Permitir preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Permitir actuator endpoints (para health checks)
                        .requestMatchers("/actuator/**").permitAll()

                        // Permitir autenticación/registro sin token ni API key
                        .requestMatchers("/auth/**").permitAll()

                        // Permitir lectura de productos sin autenticación
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()

                        // Todo lo demás requiere autenticación (validado por API key filter)
                        .anyRequest().authenticated());

        return http.build();
    }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    // CorsConfiguration config = new CorsConfiguration();
    // config.setAllowedOrigins(List.of("http://localhost:3000"));
    // config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    // config.setAllowedHeaders(List.of("*"));
    // config.setAllowCredentials(true);

    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**", config);
    // return source;
    // }
}
