package com.ist.auth.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger Configuration for IST Authentication System
 * Provides comprehensive API documentation with security schemes
 * 
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("IST Authentication System API")
                        .description("""
                                A comprehensive Identity Provider (IdP) backend providing centralized authentication 
                                and authorization services for educational institutions.
                                
                                ## Features
                                - JWT-based authentication with RSA key signing
                                - Email + Password authentication with verification
                                - LinkedIn OAuth 2.0 integration
                                - Role-based access control (Admin, Teacher, Student)
                                - Educational budget management system
                                - Client registration and management
                                - JWKS endpoint for public key distribution
                                
                                ## Authentication
                                1. Register a new account or login with existing credentials
                                2. Verify your email address (required for new accounts)
                                3. Use the access token in the Authorization header: `Bearer <token>`
                                4. Refresh tokens when access token expires
                                
                                ## Roles & Permissions
                                - **ADMIN**: Full system access, user management, budget oversight
                                - **TEACHER**: Budget management, expense approval, student oversight
                                - **STUDENT**: Basic access, expense submission, profile management
                                """)
                        .version(appVersion)
                        .contact(new Contact()
                                .name("Manzi Niyongira Osee")
                                .email("contact@ist-auth.com")
                                .url("https://github.com/manziosee/IST-auth-system"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Local Development Server"),
                        new Server()
                                .url("https://ist-auth-system-sparkling-wind-9681.fly.dev")
                                .description("Production Server")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }

    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer")
                .description("JWT Bearer token authentication. Format: `Bearer <token>`");
    }
}
