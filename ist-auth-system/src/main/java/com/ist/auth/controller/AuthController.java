package com.ist.auth.controller;

import com.ist.auth.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Authentication", description = "Authentication and user management endpoints")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @Operation(summary = "User Login", description = "Authenticate user with email/username and password")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login attempt for user: {}", sanitizeForLog(request.emailOrUsername));
        
        try {
            Map<String, Object> response = authenticationService.authenticate(
                request.emailOrUsername, 
                request.password
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Login failed for user: {}", sanitizeForLog(request.emailOrUsername), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Authentication failed"));
        }
    }
    
    @Operation(summary = "User Registration", description = "Register a new user account")
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("Registration attempt for user: {}", sanitizeForLog(request.email));
        
        try {
            Map<String, Object> response = authenticationService.register(
                request.username,
                request.email,
                request.firstName,
                request.lastName,
                request.password
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", sanitizeForLog(request.email), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Registration failed"));
        }
    }
    
    @Operation(summary = "Refresh Access Token", description = "Generate new access token using refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        logger.debug("Token refresh attempt");
        
        try {
            Map<String, Object> response = authenticationService.refreshToken(request.refreshToken);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Token refresh failed"));
        }
    }
    
    @Operation(summary = "User Logout", description = "Logout user and invalidate refresh token")
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        logger.info("Logout attempt");
        
        try {
            authenticationService.logout(request.refreshToken);
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
            
        } catch (Exception e) {
            logger.error("Logout failed", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Logout failed"));
        }
    }
    
    @PostMapping("/logout-all")
    public ResponseEntity<Map<String, Object>> logoutAllSessions(@Valid @RequestBody LogoutAllRequest request) {
        logger.info("Logout all sessions attempt for user ID: {}", request.userId);
        
        try {
            authenticationService.logoutAllSessions(request.userId);
            return ResponseEntity.ok(Map.of("message", "All sessions logged out successfully"));
            
        } catch (Exception e) {
            logger.error("Logout all sessions failed for user ID: {}", request.userId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Logout failed"));
        }
    }
    
    @Operation(summary = "Verify Email Address", description = "Verify user email using verification token")
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        logger.info("Email verification attempt");
        
        try {
            boolean verified = authenticationService.verifyEmail(request.token);
            
            if (verified) {
                return ResponseEntity.ok(Map.of(
                    "message", "Email verified successfully",
                    "verified", true
                ));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                            "error", "Invalid or expired verification token",
                            "verified", false
                        ));
            }
            
        } catch (Exception e) {
            logger.error("Email verification failed", e);
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error", "Email verification failed",
                        "verified", false
                    ));
        }
    }
    
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Object>> resendVerificationEmail(@Valid @RequestBody ResendVerificationRequest request) {
        logger.info("Resend verification email attempt for: {}", sanitizeForLog(request.email));
        
        try {
            authenticationService.resendVerificationEmail(request.email);
            return ResponseEntity.ok(Map.of(
                "message", "Verification email sent successfully",
                "emailSent", true
            ));
            
        } catch (Exception e) {
            logger.error("Resend verification email failed for: {}", sanitizeForLog(request.email), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to send verification email"));
        }
    }
    
    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@Valid @RequestBody ValidateTokenRequest request) {
        logger.debug("Token validation attempt");
        
        try {
            boolean valid = authenticationService.validateAccessToken(request.token);
            
            Map<String, Object> response = Map.of(
                "valid", valid,
                "message", valid ? "Token is valid" : "Token is invalid"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "valid", false,
                        "error", "Token validation failed"
                    ));
        }
    }
    
    // Request DTOs
    public static class LoginRequest {
        @NotBlank(message = "Email or username is required")
        public String emailOrUsername;
        
        @NotBlank(message = "Password is required")
        public String password;
    }
    
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        public String username;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        public String email;
        
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        public String firstName;
        
        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        public String lastName;
        
        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        public String password;
    }
    
    public static class RefreshTokenRequest {
        @NotBlank(message = "Refresh token is required")
        public String refreshToken;
    }
    
    public static class LogoutAllRequest {
        @NotNull(message = "User ID is required")
        public Long userId;
    }
    
    public static class VerifyEmailRequest {
        @NotBlank(message = "Verification token is required")
        public String token;
    }
    
    public static class ResendVerificationRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        public String email;
    }
    
    public static class ValidateTokenRequest {
        @NotBlank(message = "Token is required")
        public String token;
    }
    
    private String sanitizeForLog(String input) {
        if (input == null) return "null";
        return input.replaceAll("[\\r\\n\\t]", "_").replaceAll("[^\\w@.+_-]", "_");
    }
}