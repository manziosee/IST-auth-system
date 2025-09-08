package com.ist.auth.config;

import com.ist.auth.entity.*;
import com.ist.auth.repository.RoleRepository;
import com.ist.auth.repository.OAuthClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Data Initializer for setting up default roles and OAuth clients
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OAuthClientRepository oAuthClientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeOAuthClients();
    }

    private void initializeRoles() {
        // Create default roles if they don't exist
        createRoleIfNotExists("ADMIN", "System Administrator with full access");
        createRoleIfNotExists("TEACHER", "Teacher with educational management access");
        createRoleIfNotExists("STUDENT", "Student with limited access");
    }

    private void createRoleIfNotExists(String roleName, String description) {
        if (!roleRepository.existsByName(roleName)) {
            Role role = new Role(roleName, description);
            roleRepository.save(role);
            System.out.println("Created role: " + roleName);
        }
    }

    private void initializeOAuthClients() {
        // Create default OAuth client for the frontend
        createClientIfNotExists(
            "school-management-app",
            "demo-client-secret",
            "School Management Application",
            "Default client for the IST Authentication System frontend"
        );

        // Create client for widget integration
        createClientIfNotExists(
            "ist-auth-widget",
            "widget-client-secret",
            "IST Auth Widget",
            "Client for the embeddable authentication widget"
        );
    }

    private void createClientIfNotExists(String clientId, String clientSecret, String clientName, String description) {
        if (!oAuthClientRepository.existsByClientId(clientId)) {
            OAuthClient client = new OAuthClient(clientId, passwordEncoder.encode(clientSecret), clientName);
            client.setDescription(description);
            client.setRedirectUris(Set.of(
                "http://localhost:3000/auth/callback",
                "http://localhost:5173/auth/callback",
                "https://your-frontend-domain.com/auth/callback"
            ));
            client.setGrantTypes(Set.of(
                GrantType.AUTHORIZATION_CODE,
                GrantType.REFRESH_TOKEN,
                GrantType.CLIENT_CREDENTIALS
            ));
            client.setScopes(Set.of("read", "write", "profile", "email"));
            client.setAutoApprove(true);
            
            oAuthClientRepository.save(client);
            System.out.println("Created OAuth client: " + clientId);
        }
    }
}
