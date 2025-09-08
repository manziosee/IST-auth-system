package com.ist.auth.controller;

import com.ist.auth.entity.User;
import com.ist.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Test Controller for debugging authentication issues
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://ist-auth-system.vercel.app"})
public class TestController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/verify-user")
    public ResponseEntity<Map<String, Object>> verifyUserForTesting(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email is required"));
        }
        
        try {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Force verify email for testing
            user.setEmailVerified(true);
            userService.updateUser(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User email verified for testing",
                "email", user.getEmail(),
                "emailVerified", user.getEmailVerified()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to verify user: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user-status/{email}")
    public ResponseEntity<Map<String, Object>> getUserStatus(@PathVariable String email) {
        try {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            
            return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "emailVerified", user.getEmailVerified(),
                "accountEnabled", user.getAccountEnabled(),
                "accountLocked", user.getAccountLocked(),
                "failedLoginAttempts", user.getFailedLoginAttempts()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to get user status: " + e.getMessage()));
        }
    }
}