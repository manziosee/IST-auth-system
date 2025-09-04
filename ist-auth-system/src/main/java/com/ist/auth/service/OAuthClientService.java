package com.ist.auth.service;

import com.ist.auth.entity.OAuthClient;
import com.ist.auth.entity.GrantType;
import com.ist.auth.repository.OAuthClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * OAuth Client Service for managing client registrations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class OAuthClientService {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuthClientService.class);
    
    @Autowired
    private OAuthClientRepository clientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public OAuthClient registerClient(String clientName, String description, Set<String> redirectUris,
                                    Set<String> grantTypes, Set<String> scopes) {
        logger.info("Registering new OAuth client: {}", clientName);
        
        String clientId = generateClientId();
        String clientSecret = generateClientSecret();
        
        OAuthClient client = new OAuthClient();
        client.setClientId(clientId);
        client.setClientSecret(passwordEncoder.encode(clientSecret));
        client.setClientName(clientName);
        client.setDescription(description);
        client.setRedirectUris(redirectUris);
        client.setGrantTypes(convertToGrantTypes(grantTypes));
        client.setScopes(scopes);
        client.setActive(true);
        
        OAuthClient savedClient = clientRepository.save(client);
        
        // Set the plain text secret for return (only time it's available)
        savedClient.setClientSecret(clientSecret);
        
        logger.info("OAuth client registered successfully with ID: {}", clientId);
        return savedClient;
    }
    
    public OAuthClient updateClient(String clientId, String clientName, String description,
                                  Set<String> redirectUris, Set<String> grantTypes, Set<String> scopes) {
        logger.info("Updating OAuth client: {}", clientId);
        
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("OAuth client not found"));
        
        client.setClientName(clientName);
        client.setDescription(description);
        client.setRedirectUris(redirectUris);
        client.setGrantTypes(convertToGrantTypes(grantTypes));
        client.setScopes(scopes);
        
        return clientRepository.save(client);
    }
    
    public void deactivateClient(String clientId) {
        logger.info("Deactivating OAuth client: {}", clientId);
        
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("OAuth client not found"));
        
        client.setActive(false);
        clientRepository.save(client);
    }
    
    public void activateClient(String clientId) {
        logger.info("Activating OAuth client: {}", clientId);
        
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("OAuth client not found"));
        
        client.setActive(true);
        clientRepository.save(client);
    }
    
    public String regenerateClientSecret(String clientId) {
        logger.info("Regenerating client secret for: {}", clientId);
        
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("OAuth client not found"));
        
        String newSecret = generateClientSecret();
        client.setClientSecret(passwordEncoder.encode(newSecret));
        clientRepository.save(client);
        
        return newSecret;
    }
    
    public Optional<OAuthClient> findByClientId(String clientId) {
        return clientRepository.findByClientId(clientId);
    }
    
    public Optional<OAuthClient> findActiveByClientId(String clientId) {
        return clientRepository.findActiveByClientId(clientId);
    }
    
    public List<OAuthClient> getAllClients() {
        return clientRepository.findAll();
    }
    
    public List<OAuthClient> getActiveClients() {
        return clientRepository.findByActive(true);
    }
    
    public boolean validateClient(String clientId, String clientSecret) {
        Optional<OAuthClient> clientOpt = clientRepository.findActiveByClientId(clientId);
        
        if (clientOpt.isEmpty()) {
            logger.warn("OAuth client not found or inactive: {}", clientId);
            return false;
        }
        
        OAuthClient client = clientOpt.get();
        boolean valid = passwordEncoder.matches(clientSecret, client.getClientSecret());
        
        if (!valid) {
            logger.warn("Invalid client secret for client: {}", clientId);
        }
        
        return valid;
    }
    
    public boolean isValidRedirectUri(String clientId, String redirectUri) {
        Optional<OAuthClient> clientOpt = clientRepository.findActiveByClientId(clientId);
        
        if (clientOpt.isEmpty()) {
            return false;
        }
        
        OAuthClient client = clientOpt.get();
        return client.getRedirectUris().contains(redirectUri);
    }
    
    public boolean supportsGrantType(String clientId, String grantType) {
        Optional<OAuthClient> clientOpt = clientRepository.findActiveByClientId(clientId);
        
        if (clientOpt.isEmpty()) {
            return false;
        }
        
        OAuthClient client = clientOpt.get();
        try {
            GrantType enumGrantType = GrantType.valueOf(grantType.toUpperCase());
            return client.getGrantTypes().contains(enumGrantType);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    public boolean hasScope(String clientId, String scope) {
        Optional<OAuthClient> clientOpt = clientRepository.findActiveByClientId(clientId);
        
        if (clientOpt.isEmpty()) {
            return false;
        }
        
        OAuthClient client = clientOpt.get();
        return client.getScopes().contains(scope);
    }
    
    private String generateClientId() {
        String clientId;
        do {
            clientId = "ist_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        } while (clientRepository.existsByClientId(clientId));
        
        return clientId;
    }
    
    private String generateClientSecret() {
        return UUID.randomUUID().toString().replace("-", "") + 
               UUID.randomUUID().toString().replace("-", "");
    }
    
    private Set<GrantType> convertToGrantTypes(Set<String> grantTypeStrings) {
        return grantTypeStrings.stream()
                .map(grantType -> {
                    try {
                        return GrantType.valueOf(grantType.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid grant type: {}", grantType);
                        throw new IllegalArgumentException("Invalid grant type: " + grantType);
                    }
                })
                .collect(Collectors.toSet());
    }
    
    public void createDefaultClients() {
        logger.info("Creating default OAuth clients");
        
        // Frontend application client
        if (!clientRepository.existsByClientId("ist_frontend_app")) {
            OAuthClient frontendClient = new OAuthClient();
            frontendClient.setClientId("ist_frontend_app");
            frontendClient.setClientSecret(passwordEncoder.encode("frontend_secret_2025"));
            frontendClient.setClientName("IST Frontend Application");
            frontendClient.setDescription("Default client for IST Auth System frontend");
            frontendClient.setRedirectUris(Set.of(
                "http://localhost:3000/oauth/callback",
                "http://localhost:5173/oauth/callback",
                "https://ist-auth-frontend.netlify.app/oauth/callback"
            ));
            frontendClient.setGrantTypes(Set.of(GrantType.AUTHORIZATION_CODE, GrantType.REFRESH_TOKEN));
            frontendClient.setScopes(Set.of("openid", "profile", "email"));
            frontendClient.setActive(true);
            
            clientRepository.save(frontendClient);
            logger.info("Default frontend client created");
        }
        
        // Demo application client
        if (!clientRepository.existsByClientId("ist_demo_app")) {
            OAuthClient demoClient = new OAuthClient();
            demoClient.setClientId("ist_demo_app");
            demoClient.setClientSecret(passwordEncoder.encode("demo_secret_2025"));
            demoClient.setClientName("IST Demo Application");
            demoClient.setDescription("Demo client for testing IST Auth System integration");
            demoClient.setRedirectUris(Set.of(
                "http://localhost:8081/callback",
                "https://demo-app.example.com/callback"
            ));
            demoClient.setGrantTypes(Set.of(GrantType.AUTHORIZATION_CODE, GrantType.REFRESH_TOKEN));
            demoClient.setScopes(Set.of("openid", "profile", "email"));
            demoClient.setActive(true);
            
            clientRepository.save(demoClient);
            logger.info("Default demo client created");
        }
    }
}
