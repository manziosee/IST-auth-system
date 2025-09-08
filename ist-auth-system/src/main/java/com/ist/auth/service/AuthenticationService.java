package com.ist.auth.service;

import com.ist.auth.entity.RefreshToken;
import com.ist.auth.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication Service for handling login, registration, and token operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class AuthenticationService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private EmailVerificationService emailVerificationService;
    

    
    public Map<String, Object> authenticate(String emailOrUsername, String password) {
        logger.info("Authenticating user: {}", emailOrUsername);
        
        Optional<User> userOpt = userService.findByEmailOrUsername(emailOrUsername);
        if (userOpt.isEmpty()) {
            logger.warn("User not found: {}", emailOrUsername);
            throw new UsernameNotFoundException("User not found");
        }
        
        User user = userOpt.get();
        
        // Check if account is locked
        if (user.getAccountLocked()) {
            logger.warn("Account is locked: {}", user.getEmail());
            throw new BadCredentialsException("Account is locked due to too many failed login attempts");
        }
        
        // Check if account is enabled
        if (!user.getAccountEnabled()) {
            logger.warn("Account is disabled: {}", user.getEmail());
            throw new BadCredentialsException("Account is disabled");
        }
        
        // Verify password
        if (!userService.verifyPassword(user, password)) {
            logger.warn("Invalid password for user: {}", user.getEmail());
            userService.incrementFailedLoginAttempts(user);
            throw new BadCredentialsException("Invalid credentials");
        }
        
        // Check email verification
        if (!user.getEmailVerified()) {
            logger.warn("Email not verified for user: {}", user.getEmail());
            throw new BadCredentialsException("Email not verified. Please check your email for verification link.");
        }
        
        // Reset failed login attempts and update last login
        userService.resetFailedLoginAttempts(user);
        userService.updateLastLogin(user);
        
        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken.getToken());
        response.put("tokenType", "Bearer");
        response.put("expiresIn", jwtService.getAccessTokenExpiration() / 1000);
        response.put("user", buildUserResponse(user));
        
        logger.info("User authenticated successfully: {}", user.getEmail());
        return response;
    }
    
    public Map<String, Object> register(String username, String email, String firstName, String lastName, String password, String role) {
        logger.info("Registering new user: {}", email);
        
        try {
            User user = userService.createUser(username, email, firstName, lastName, password, role);
            
            // Send verification email
            emailVerificationService.sendVerificationEmail(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully. Please check your email for verification link.");
            response.put("user", buildUserResponse(user));
            response.put("emailSent", true);
            
            logger.info("User registered successfully: {}", email);
            return response;
            
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", email, e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    public Map<String, Object> refreshToken(String refreshTokenValue) {
        logger.debug("Refreshing access token");
        
        Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(refreshTokenValue);
        if (tokenOpt.isEmpty()) {
            logger.warn("Refresh token not found");
            throw new BadCredentialsException("Refresh token not found");
        }
        
        RefreshToken refreshToken = refreshTokenService.verifyExpiration(tokenOpt.get());
        User user = refreshToken.getUser();
        
        // Check if user account is still active
        if (!user.getAccountEnabled() || user.getAccountLocked()) {
            logger.warn("User account is disabled or locked: {}", user.getEmail());
            refreshTokenService.revokeAllUserTokens(user);
            throw new BadCredentialsException("Account is disabled or locked");
        }
        
        // Generate new access token
        String accessToken = jwtService.generateAccessToken(user);
        
        // Optionally rotate refresh token (for enhanced security)
        RefreshToken newRefreshToken = refreshTokenService.rotateToken(refreshToken);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", newRefreshToken.getToken());
        response.put("tokenType", "Bearer");
        response.put("expiresIn", jwtService.getAccessTokenExpiration() / 1000);
        
        logger.debug("Access token refreshed successfully for user: {}", user.getEmail());
        return response;
    }
    
    public void logout(String refreshTokenValue) {
        logger.info("Logging out user");
        
        Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(refreshTokenValue);
        if (tokenOpt.isPresent()) {
            RefreshToken refreshToken = tokenOpt.get();
            refreshTokenService.revokeToken(refreshToken);
            logger.info("User logged out successfully: {}", refreshToken.getUser().getEmail());
        }
    }
    
    public void logoutAllSessions(Long userId) {
        logger.info("Logging out all sessions for user ID: {}", userId);
        
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isPresent()) {
            refreshTokenService.logoutAllSessions(userOpt.get());
            logger.info("All sessions logged out for user: {}", userOpt.get().getEmail());
        }
    }
    
    public boolean verifyEmail(String token) {
        logger.info("Verifying email with token");
        return emailVerificationService.verifyEmail(token);
    }
    
    public void resendVerificationEmail(String email) {
        logger.info("Resending verification email to: {}", email);
        emailVerificationService.resendVerificationEmail(email);
    }
    
    public Map<String, Object> authenticateOAuth(String email, String firstName, String lastName, String providerId, String provider) {
        logger.info("Authenticating OAuth user: {} from provider: {}", email, provider);
        
        User user = userService.createOAuthUser(email, firstName, lastName, providerId, provider);
        userService.updateLastLogin(user);
        
        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken.getToken());
        response.put("tokenType", "Bearer");
        response.put("expiresIn", jwtService.getAccessTokenExpiration() / 1000);
        response.put("user", buildUserResponse(user));
        
        logger.info("OAuth user authenticated successfully: {}", user.getEmail());
        return response;
    }
    
    public boolean validateAccessToken(String token) {
        return jwtService.validateToken(token) && jwtService.isAccessToken(token);
    }
    
    public User getUserFromToken(String token) {
        if (!validateAccessToken(token)) {
            throw new BadCredentialsException("Invalid access token");
        }
        
        String userId = jwtService.getUserIdFromToken(token);
        if (userId == null) {
            throw new BadCredentialsException("Invalid token claims");
        }
        
        Long userIdLong;
        try {
            userIdLong = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            throw new BadCredentialsException("Invalid user ID format");
        }
        
        Optional<User> userOpt = userService.findById(userIdLong);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        
        return userOpt.get();
    }
    
    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("emailVerified", user.getEmailVerified());
        userResponse.put("authProvider", user.getAuthProvider() != null ? user.getAuthProvider().toString() : "UNKNOWN");
        userResponse.put("roles", user.getRoles().stream()
                .map(role -> role.getName())
                .toList());
        userResponse.put("createdAt", user.getCreatedAt());
        userResponse.put("lastLogin", user.getLastLogin());
        
        return userResponse;
    }
}
