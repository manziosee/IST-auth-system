package com.ist.auth.service;

import com.ist.auth.entity.Role;
import com.ist.auth.entity.User;
import com.ist.auth.repository.RoleRepository;
import com.ist.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * User Service for user management operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(String username, String email, String firstName, String lastName, String password, String roleName) {
        logger.info("Creating new user with email: {} and role: {}", email, roleName);
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }
        
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("User with username " + username + " already exists");
        }
        
        User user = new User(username, email, firstName, lastName);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setEmailVerified(false); // Must verify email to login
        user.setAccountEnabled(true);
        
        // Assign specified role or default to STUDENT
        String roleToAssign = (roleName != null && !roleName.trim().isEmpty()) ? roleName.toUpperCase() : "STUDENT";
        Role userRole = roleRepository.findByName(roleToAssign)
                .orElseGet(() -> roleRepository.findByName("STUDENT")
                    .orElseThrow(() -> new RuntimeException("Default role STUDENT not found")));
        user.addRole(userRole);
        
        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {}", savedUser.getId());
        
        return savedUser;
    }
    
    public User createOAuthUser(String email, String firstName, String lastName, String providerId, String provider) {
        logger.info("Creating OAuth user with email: {} from provider: {}", email, provider);
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update provider info if user exists
            user.setProviderId(providerId);
            user.setAuthProvider(User.AuthProvider.valueOf(provider.toUpperCase()));
            user.setEmailVerified(true); // OAuth emails are pre-verified
            user.setLastLogin(LocalDateTime.now());
            return userRepository.save(user);
        }
        
        // Create username from email
        String username = email.split("@")[0];
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = email.split("@")[0] + counter++;
        }
        
        User user = new User(username, email, firstName, lastName);
        user.setProviderId(providerId);
        user.setAuthProvider(User.AuthProvider.valueOf(provider.toUpperCase()));
        user.setEmailVerified(true);
        user.setAccountEnabled(true);
        
        // Assign default role
        Role defaultRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Default role STUDENT not found"));
        user.addRole(defaultRole);
        
        User savedUser = userRepository.save(user);
        logger.info("OAuth user created successfully with ID: {}", savedUser.getId());
        
        return savedUser;
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findByEmailOrUsername(String emailOrUsername) {
        return userRepository.findByEmailOrUsername(emailOrUsername, emailOrUsername);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public boolean verifyPassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPasswordHash());
    }
    
    public void verifyEmail(User user) {
        logger.info("Verifying email for user: {}", user.getEmail());
        user.setEmailVerified(true);
        userRepository.save(user);
    }
    
    public void updateLastLogin(User user) {
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
    
    public void resetFailedLoginAttempts(User user) {
        user.resetFailedLoginAttempts();
        userRepository.save(user);
    }
    
    public void incrementFailedLoginAttempts(User user) {
        user.incrementFailedLoginAttempts();
        userRepository.save(user);
        
        if (user.getAccountLocked()) {
            logger.warn("User account locked due to failed login attempts: {}", user.getEmail());
        }
    }
    
    public void unlockAccount(User user) {
        logger.info("Unlocking account for user: {}", user.getEmail());
        user.resetFailedLoginAttempts();
        userRepository.save(user);
    }
    
    public void assignRole(User user, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found"));
        
        if (!user.hasRole(roleName)) {
            user.addRole(role);
            userRepository.save(user);
            logger.info("Role {} assigned to user: {}", roleName, user.getEmail());
        }
    }
    
    public void removeRole(User user, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found"));
        
        if (user.hasRole(roleName)) {
            user.removeRole(role);
            userRepository.save(user);
            logger.info("Role {} removed from user: {}", roleName, user.getEmail());
        }
    }
    
    public List<User> findUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName);
    }
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    public void deleteUser(Long userId) {
        logger.info("Deleting user with ID: {}", userId);
        userRepository.deleteById(userId);
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public void changePassword(User user, String newPassword) {
        logger.info("Changing password for user: {}", user.getEmail());
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public long getTotalUserCount() {
        return userRepository.count();
    }
    
    public long getNewUsersCount(LocalDateTime since) {
        return userRepository.countUsersCreatedAfter(since);
    }
    
    public long getActiveUsersCount(LocalDateTime since) {
        return userRepository.countActiveUsersAfter(since);
    }
    
    public List<User> getLockedUsers() {
        return userRepository.findLockedUsers();
    }
    
    public void cleanupUnverifiedUsers(int daysOld) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(daysOld);
        List<User> unverifiedUsers = userRepository.findUnverifiedUsersOlderThan(cutoffTime);
        
        logger.info("Cleaning up {} unverified users older than {} days", unverifiedUsers.size(), daysOld);
        userRepository.deleteAll(unverifiedUsers);
    }
}
