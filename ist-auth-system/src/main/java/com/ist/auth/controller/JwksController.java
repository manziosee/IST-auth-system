package com.ist.auth.controller;

import com.ist.auth.service.JwtService;
import com.nimbusds.jose.jwk.JWKSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * JWKS (JSON Web Key Set) Controller for exposing public keys
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@RestController
@RequestMapping("/.well-known")
public class JwksController {
    
    private static final Logger logger = LoggerFactory.getLogger(JwksController.class);
    
    @Autowired
    private JwtService jwtService;
    
    @GetMapping(value = "/jwks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getJWKS() {
        logger.debug("JWKS endpoint accessed");
        
        try {
            JWKSet jwkSet = jwtService.getJWKSet();
            Map<String, Object> jwksResponse = jwkSet.toJSONObject();
            
            logger.debug("JWKS response generated successfully");
            return ResponseEntity.ok()
                    .header("Cache-Control", "public, max-age=3600") // Cache for 1 hour
                    .body(jwksResponse);
                    
        } catch (Exception e) {
            logger.error("Failed to generate JWKS response", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping(value = "/openid_configuration", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getOpenIdConfiguration() {
        logger.debug("OpenID Configuration endpoint accessed");
        
        Map<String, Object> config = Map.of(
            "issuer", "ist-auth-system",
            "jwks_uri", "/.well-known/jwks.json",
            "authorization_endpoint", "/oauth2/authorize",
            "token_endpoint", "/oauth2/token",
            "userinfo_endpoint", "/oauth2/userinfo",
            "response_types_supported", new String[]{"code", "token", "id_token"},
            "subject_types_supported", new String[]{"public"},
            "id_token_signing_alg_values_supported", new String[]{"RS256"},
            "scopes_supported", new String[]{"openid", "profile", "email"},
            "claims_supported", new String[]{"sub", "email", "username", "firstName", "lastName", "roles"}
        );
        
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=3600")
                .body(config);
    }
}
