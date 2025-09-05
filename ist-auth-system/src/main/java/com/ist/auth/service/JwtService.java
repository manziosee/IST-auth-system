package com.ist.auth.service;

import com.ist.auth.entity.JwtKeyPair;
import com.ist.auth.entity.User;
import com.ist.auth.repository.JwtKeyPairRepository;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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
    
    @Autowired
    private JwtKeyPairRepository keyPairRepository;
    
    private RSAPrivateKey privateKey;
    private RSAPublicKey publicKey;
    private String keyId;
    private JWKSet jwkSet;
    private RSASSASigner signer;
    private RSASSAVerifier verifier;
    
    @PostConstruct
    public void init() {
        try {
            loadOrGenerateKeyPair();
            createJWKSet();
            createSignerAndVerifier();
            logger.info("JWT Service initialized with RSA key pair: {}", keyId);
        } catch (Exception e) {
            logger.error("Failed to initialize JWT Service", e);
            throw new RuntimeException("JWT Service initialization failed", e);
        }
    }
    
    private void loadOrGenerateKeyPair() throws Exception {
        Optional<JwtKeyPair> existingKeyPair = keyPairRepository.findByActiveTrue();
        
        if (existingKeyPair.isPresent()) {
            loadExistingKeyPair(existingKeyPair.get());
            logger.info("Loaded existing RSA key pair: {}", keyId);
        } else {
            generateAndSaveKeyPair();
            logger.info("Generated new RSA key pair: {}", keyId);
        }
    }
    
    private void loadExistingKeyPair(JwtKeyPair keyPairEntity) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(keyPairEntity.getPrivateKey());
        this.privateKey = (RSAPrivateKey) keyFactory.generatePrivate(privateKeySpec);
        
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(keyPairEntity.getPublicKey());
        this.publicKey = (RSAPublicKey) keyFactory.generatePublic(publicKeySpec);
        
        this.keyId = keyPairEntity.getKeyId();
    }
    
    private void generateAndSaveKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(keySize);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        
        this.privateKey = (RSAPrivateKey) keyPair.getPrivate();
        this.publicKey = (RSAPublicKey) keyPair.getPublic();
        this.keyId = UUID.randomUUID().toString();
        
        // Save to database
        JwtKeyPair keyPairEntity = new JwtKeyPair(
            keyId,
            privateKey.getEncoded(),
            publicKey.getEncoded()
        );
        keyPairRepository.save(keyPairEntity);
    }
    
    private void createJWKSet() throws JOSEException {
        JWK jwk = new RSAKey.Builder(publicKey)
                .keyID(keyId)
                .algorithm(JWSAlgorithm.RS256)
                .keyUse(com.nimbusds.jose.jwk.KeyUse.SIGNATURE)
                .build();
        
        this.jwkSet = new JWKSet(jwk);
    }
    
    private void createSignerAndVerifier() throws JOSEException {
        this.signer = new RSASSASigner(privateKey);
        this.verifier = new RSASSAVerifier(publicKey);
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
            
            signedJWT.sign(signer);
            
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
            
            signedJWT.sign(signer);
            
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
            if (!signedJWT.verify(verifier)) {
                logger.warn("Token signature verification failed");
                return false;
            }
            
            // Check expiration and not before with single date
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            Date now = new Date();
            
            Date expiration = claims.getExpirationTime();
            if (expiration == null || expiration.before(now)) {
                logger.warn("Token is expired");
                return false;
            }
            
            Date notBefore = claims.getNotBeforeTime();
            if (notBefore != null && notBefore.after(now)) {
                logger.warn("Token is not yet valid");
                return false;
            }
            
            return true;
            
        } catch (Exception e) {
            logger.warn("Token validation failed: {}", e.getMessage());
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
