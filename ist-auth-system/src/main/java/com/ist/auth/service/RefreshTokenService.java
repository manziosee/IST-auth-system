package com.ist.auth.service;

import com.ist.auth.entity.RefreshToken;
import com.ist.auth.entity.User;
import com.ist.auth.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Refresh Token Service for managing JWT refresh tokens
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class RefreshTokenService {
    
    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenService.class);
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    @Autowired
    private JwtService jwtService;
    
    @Value("${app.jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;
    
    @Value("${app.jwt.max-refresh-tokens-per-user:5}")
    private int maxRefreshTokensPerUser;
    
    public RefreshToken createRefreshToken(User user) {
        logger.debug("Creating refresh token for user: {}", user.getEmail());
        
        // Clean up old tokens if user has too many
        cleanupUserTokens(user);
        
        String tokenValue = jwtService.generateRefreshToken(user);
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(tokenValue);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000));
        refreshToken.setRevoked(false);
        
        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        logger.debug("Refresh token created successfully for user: {}", user.getEmail());
        
        return savedToken;
    }
    
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
    
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        
        if (token.getRevoked()) {
            throw new RuntimeException("Refresh token was revoked. Please make a new signin request");
        }
        
        return token;
    }
    
    public boolean isValidToken(String tokenValue) {
        try {
            Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(tokenValue);
            if (tokenOpt.isEmpty()) {
                return false;
            }
            
            RefreshToken token = tokenOpt.get();
            
            // Check if token is expired or revoked
            if (token.getExpiresAt().isBefore(LocalDateTime.now()) || token.getRevoked()) {
                return false;
            }
            
            // Validate JWT signature and claims
            return jwtService.validateToken(tokenValue) && jwtService.isRefreshToken(tokenValue);
            
        } catch (Exception e) {
            logger.warn("Token validation failed", e);
            return false;
        }
    }
    
    public void revokeToken(RefreshToken token) {
        logger.debug("Revoking refresh token for user: {}", token.getUser().getEmail());
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }
    
    public void revokeAllUserTokens(User user) {
        logger.info("Revoking all refresh tokens for user: {}", user.getEmail());
        refreshTokenRepository.revokeAllUserTokens(user);
    }
    
    public void deleteToken(RefreshToken token) {
        logger.debug("Deleting refresh token for user: {}", token.getUser().getEmail());
        refreshTokenRepository.delete(token);
    }
    
    public List<RefreshToken> getValidTokensByUser(User user) {
        return refreshTokenRepository.findValidTokensByUser(user, LocalDateTime.now());
    }
    
    public long countValidTokensByUser(User user) {
        return refreshTokenRepository.countValidTokensByUser(user);
    }
    
    private void cleanupUserTokens(User user) {
        long tokenCount = countValidTokensByUser(user);
        
        if (tokenCount >= maxRefreshTokensPerUser) {
            logger.debug("User {} has {} tokens, cleaning up oldest ones", user.getEmail(), tokenCount);
            
            List<RefreshToken> userTokens = getValidTokensByUser(user);
            // Sort by creation date and remove oldest tokens
            userTokens.stream()
                    .sorted((t1, t2) -> t1.getCreatedAt().compareTo(t2.getCreatedAt()))
                    .limit(tokenCount - maxRefreshTokensPerUser + 1)
                    .forEach(this::revokeToken);
        }
    }
    
    public RefreshToken rotateToken(RefreshToken oldToken) {
        logger.debug("Rotating refresh token for user: {}", oldToken.getUser().getEmail());
        
        // Revoke old token
        revokeToken(oldToken);
        
        // Create new token
        return createRefreshToken(oldToken.getUser());
    }
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupExpiredTokens() {
        logger.debug("Running scheduled cleanup of expired refresh tokens");
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(1);
        refreshTokenRepository.deleteExpiredAndRevokedTokens(cutoffTime);
        
        logger.debug("Expired refresh tokens cleanup completed");
    }
    
    public void logoutUser(User user) {
        logger.info("Logging out user: {}", user.getEmail());
        revokeAllUserTokens(user);
    }
    
    public void logoutAllSessions(User user) {
        logger.info("Logging out all sessions for user: {}", user.getEmail());
        revokeAllUserTokens(user);
    }
    
    public List<RefreshToken> getUserTokens(User user) {
        return refreshTokenRepository.findByUser(user);
    }
    
    public void revokeTokenByValue(String tokenValue) {
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(tokenValue);
        if (tokenOpt.isPresent()) {
            revokeToken(tokenOpt.get());
        }
    }
}
