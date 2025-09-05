package com.ist.auth.service;

import com.ist.auth.entity.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * JWT Service for token generation and validation
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
public class JwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    
    @Value("${app.jwt.access-token-expiration:900000}")
    private long accessTokenExpiration;
    
    @Value("${app.jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;
    
    @Value("${app.jwt.key-size:2048}")
    private int keySize;
    
    private RSAPrivateKey privateKey;
    private RSAPublicKey publicKey;
    private String keyId;
    private JWKSet jwkSet;
    
    @PostConstruct
    public void init() {
        generateKeyPair();
        createJWKSet();
        logger.info("JWT Service initialized with RSA key pair");
    }
    
    private void generateKeyPair() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(keySize);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            
            this.privateKey = (RSAPrivateKey) keyPair.getPrivate();
            this.publicKey = (RSAPublicKey) keyPair.getPublic();
            this.keyId = UUID.randomUUID().toString();
            
            logger.info("RSA key pair generated successfully with key ID: {}", keyId);
        } catch (Exception e) {
            logger.error("Failed to generate RSA key pair", e);
            throw new RuntimeException("Failed to generate RSA key pair", e);
        }
    }
    
    private void createJWKSet() {
        try {
            JWK jwk = new RSAKey.Builder(publicKey)
                    .keyID(keyId)
                    .algorithm(JWSAlgorithm.RS256)
                    .keyUse(com.nimbusds.jose.jwk.KeyUse.SIGNATURE)
                    .build();
            
            this.jwkSet = new JWKSet(jwk);
            logger.info("JWK Set created successfully");
        } catch (Exception e) {
            logger.error("Failed to create JWK Set", e);
            throw new RuntimeException("Failed to create JWK Set", e);
        }
    }
    
    public String generateAccessToken(User user) {
        try {
            Instant now = Instant.now();
            Instant expiration = now.plusMillis(accessTokenExpiration);
            
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getId().toString())
                    .issuer("ist-auth-system")
                    .audience("ist-clients")
                    .expirationTime(Date.from(expiration))
                    .issueTime(Date.from(now))
                    .notBeforeTime(Date.from(now))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("email", user.getEmail())
                    .claim("username", user.getUsername())
                    .claim("firstName", user.getFirstName())
                    .claim("lastName", user.getLastName())
                    .claim("roles", user.getRoles().stream()
                            .map(role -> role.getName())
                            .toList())
                    .claim("emailVerified", user.getEmailVerified())
                    .claim("authProvider", user.getAuthProvider().toString())
                    .claim("tokenType", "access")
                    .build();
            
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.RS256)
                            .keyID(keyId)
                            .type(JOSEObjectType.JWT)
                            .build(),
                    claimsSet
            );
            
            signedJWT.sign(new RSASSASigner(privateKey));
            
            logger.debug("Access token generated for user: {}", user.getEmail());
            return signedJWT.serialize();
            
        } catch (Exception e) {
            logger.error("Failed to generate access token for user: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to generate access token", e);
        }
    }
    
    public String generateRefreshToken(User user) {
        try {
            Instant now = Instant.now();
            Instant expiration = now.plusMillis(refreshTokenExpiration);
            
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getId().toString())
                    .issuer("ist-auth-system")
                    .audience("ist-clients")
                    .expirationTime(Date.from(expiration))
                    .issueTime(Date.from(now))
                    .notBeforeTime(Date.from(now))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("tokenType", "refresh")
                    .claim("email", user.getEmail())
                    .build();
            
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.RS256)
                            .keyID(keyId)
                            .type(JOSEObjectType.JWT)
                            .build(),
                    claimsSet
            );
            
            signedJWT.sign(new RSASSASigner(privateKey));
            
            logger.debug("Refresh token generated for user: {}", user.getEmail());
            return signedJWT.serialize();
            
        } catch (Exception e) {
            logger.error("Failed to generate refresh token for user: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to generate refresh token", e);
        }
    }
    
    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            
            // Verify signature
            JWSVerifier verifier = new RSASSAVerifier(publicKey);
            if (!signedJWT.verify(verifier)) {
                logger.warn("Token signature verification failed");
                return false;
            }
            
            // Check expiration
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            Date expiration = claims.getExpirationTime();
            if (expiration == null || expiration.before(new Date())) {
                logger.warn("Token is expired");
                return false;
            }
            
            // Check not before
            Date notBefore = claims.getNotBeforeTime();
            if (notBefore != null && notBefore.after(new Date())) {
                logger.warn("Token is not yet valid");
                return false;
            }
            
            logger.debug("Token validation successful");
            return true;
            
        } catch (Exception e) {
            logger.warn("Token validation failed", e);
            return false;
        }
    }
    
    public JWTClaimsSet getClaimsFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet();
        } catch (Exception e) {
            logger.error("Failed to extract claims from token", e);
            throw new RuntimeException("Failed to extract claims from token", e);
        }
    }
    
    public String getUserIdFromToken(String token) {
        try {
            JWTClaimsSet claims = getClaimsFromToken(token);
            return claims.getSubject();
        } catch (Exception e) {
            logger.error("Failed to extract user ID from token", e);
            return null;
        }
    }
    
    public String getEmailFromToken(String token) {
        try {
            JWTClaimsSet claims = getClaimsFromToken(token);
            return claims.getStringClaim("email");
        } catch (Exception e) {
            logger.error("Failed to extract email from token", e);
            return null;
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        try {
            JWTClaimsSet claims = getClaimsFromToken(token);
            return (List<String>) claims.getClaim("roles");
        } catch (Exception e) {
            logger.error("Failed to extract roles from token", e);
            return List.of();
        }
    }
    
    public String getTokenType(String token) {
        try {
            JWTClaimsSet claims = getClaimsFromToken(token);
            return claims.getStringClaim("tokenType");
        } catch (Exception e) {
            logger.error("Failed to extract token type from token", e);
            return null;
        }
    }
    
    public boolean isAccessToken(String token) {
        return "access".equals(getTokenType(token));
    }
    
    public boolean isRefreshToken(String token) {
        return "refresh".equals(getTokenType(token));
    }
    
    public JWKSet getJWKSet() {
        return jwkSet;
    }
    
    public RSAPublicKey getPublicKey() {
        return publicKey;
    }
    
    public String getKeyId() {
        return keyId;
    }
    
    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }
    
    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }
}
