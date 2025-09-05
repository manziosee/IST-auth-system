package com.ist.auth.controller;

import com.ist.auth.entity.OAuthClient;
import com.ist.auth.service.OAuthClientService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * OAuth Client Controller for client registration and management
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@RestController
@RequestMapping("/api/oauth/clients")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class OAuthClientController {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuthClientController.class);
    
    @Autowired
    private OAuthClientService clientService;
    
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> registerClient(@Valid @RequestBody RegisterClientRequest request) {
        logger.info("Registering OAuth client: {}", request.clientName);
        
        try {
            OAuthClient client = clientService.registerClient(
                request.clientName,
                request.description,
                request.redirectUris,
                request.grantTypes,
                request.scopes
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "OAuth client registered successfully",
                "clientId", client.getClientId(),
                "clientSecret", client.getClientSecret(), // Only returned once
                "client", buildClientResponse(client, false)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to register OAuth client: {}", request.clientName, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateClient(@PathVariable String clientId,
                                                          @Valid @RequestBody UpdateClientRequest request) {
        logger.info("Updating OAuth client: {}", clientId);
        
        try {
            OAuthClient client = clientService.updateClient(
                clientId,
                request.clientName,
                request.description,
                request.redirectUris,
                request.grantTypes,
                request.scopes
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "OAuth client updated successfully",
                "client", buildClientResponse(client, false)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to update OAuth client: {}", clientId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{clientId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deactivateClient(@PathVariable String clientId) {
        logger.info("Deactivating OAuth client: {}", clientId);
        
        try {
            clientService.deactivateClient(clientId);
            return ResponseEntity.ok(Map.of("message", "OAuth client deactivated successfully"));
            
        } catch (Exception e) {
            logger.error("Failed to deactivate OAuth client: {}", clientId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{clientId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> activateClient(@PathVariable String clientId) {
        logger.info("Activating OAuth client: {}", clientId);
        
        try {
            clientService.activateClient(clientId);
            return ResponseEntity.ok(Map.of("message", "OAuth client activated successfully"));
            
        } catch (Exception e) {
            logger.error("Failed to activate OAuth client: {}", clientId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{clientId}/regenerate-secret")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> regenerateClientSecret(@PathVariable String clientId) {
        logger.info("Regenerating client secret for: {}", clientId);
        
        try {
            String newSecret = clientService.regenerateClientSecret(clientId);
            return ResponseEntity.ok(Map.of(
                "message", "Client secret regenerated successfully",
                "clientSecret", newSecret // Only returned once
            ));
            
        } catch (Exception e) {
            logger.error("Failed to regenerate client secret: {}", clientId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllClients() {
        logger.debug("Fetching all OAuth clients");
        
        List<OAuthClient> clients = clientService.getAllClients();
        List<Map<String, Object>> response = clients.stream()
                .map(client -> buildClientResponse(client, false))
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Map<String, Object>>> getActiveClients() {
        logger.debug("Fetching active OAuth clients");
        
        List<OAuthClient> clients = clientService.getActiveClients();
        List<Map<String, Object>> response = clients.stream()
                .map(client -> buildClientResponse(client, false))
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getClient(@PathVariable String clientId) {
        logger.debug("Fetching OAuth client: {}", clientId);
        
        try {
            OAuthClient client = clientService.findByClientId(clientId)
                    .orElseThrow(() -> new RuntimeException("OAuth client not found"));
            
            return ResponseEntity.ok(buildClientResponse(client, false));
            
        } catch (Exception e) {
            logger.error("Failed to fetch OAuth client: {}", clientId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateClient(@Valid @RequestBody ValidateClientRequest request) {
        logger.debug("Validating OAuth client credentials");
        
        boolean valid = clientService.validateClient(request.clientId, request.clientSecret);
        
        return ResponseEntity.ok(Map.of(
            "valid", valid,
            "message", valid ? "Client credentials are valid" : "Invalid client credentials"
        ));
    }
    
    private Map<String, Object> buildClientResponse(OAuthClient client, boolean includeSecret) {
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", client.getId());
        response.put("clientId", client.getClientId());
        response.put("clientName", client.getClientName());
        response.put("description", client.getDescription() != null ? client.getDescription() : "");
        response.put("redirectUris", client.getRedirectUris());
        response.put("grantTypes", client.getGrantTypes());
        response.put("scopes", client.getScopes());
        response.put("active", client.getActive());
        response.put("createdAt", client.getCreatedAt());
        response.put("updatedAt", client.getUpdatedAt());
        
        if (includeSecret) {
            response.put("clientSecret", client.getClientSecret());
        }
        
        return response;
    }
    
    // Request DTOs
    public static class RegisterClientRequest {
        @NotBlank(message = "Client name is required")
        public String clientName;
        
        public String description;
        
        @NotEmpty(message = "At least one redirect URI is required")
        public Set<String> redirectUris;
        
        @NotEmpty(message = "At least one grant type is required")
        public Set<String> grantTypes;
        
        @NotEmpty(message = "At least one scope is required")
        public Set<String> scopes;
    }
    
    public static class UpdateClientRequest {
        @NotBlank(message = "Client name is required")
        public String clientName;
        
        public String description;
        
        @NotEmpty(message = "At least one redirect URI is required")
        public Set<String> redirectUris;
        
        @NotEmpty(message = "At least one grant type is required")
        public Set<String> grantTypes;
        
        @NotEmpty(message = "At least one scope is required")
        public Set<String> scopes;
    }
    
    public static class ValidateClientRequest {
        @NotBlank(message = "Client ID is required")
        public String clientId;
        
        @NotBlank(message = "Client secret is required")
        public String clientSecret;
    }
}
