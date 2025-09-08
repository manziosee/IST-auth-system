package com.ist.auth.controller;

import com.ist.auth.entity.User;
import com.ist.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://ist-auth-system.vercel.app"})
@Tag(name = "Admin", description = "Admin management endpoints")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "Get All Users", description = "Get list of all users (Admin only)")
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        logger.info("Admin fetching all users");
        
        List<User> users = userService.findAllUsers();
        List<Map<String, Object>> response = users.stream()
                .map(this::buildUserResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Verify User Email", description = "Manually verify user email (Admin only)")
    @PostMapping("/users/{userId}/verify-email")
    public ResponseEntity<Map<String, Object>> verifyUserEmail(@PathVariable Long userId) {
        logger.info("Admin verifying email for user ID: {}", userId);
        
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            userService.verifyEmail(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User email verified successfully",
                "user", buildUserResponse(user)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to verify user email: {}", userId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    private Map<String, Object> buildUserResponse(User user) {
        return Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "emailVerified", user.getEmailVerified(),
            "accountEnabled", user.getAccountEnabled(),
            "roles", user.getRoles().stream().map(role -> role.getName()).toList(),
            "createdAt", user.getCreatedAt(),
            "lastLogin", user.getLastLogin()
        );
    }
}