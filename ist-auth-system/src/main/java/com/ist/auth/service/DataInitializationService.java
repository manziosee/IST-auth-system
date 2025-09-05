package com.ist.auth.service;

import com.ist.auth.entity.Role;
import com.ist.auth.entity.User;
import com.ist.auth.repository.RoleRepository;
import com.ist.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Data Initialization Service for setting up default roles and admin user
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class DataInitializationService implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializationService.class);
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private OAuthClientService oAuthClientService;
    
    @Autowired
    private BudgetService budgetService;
    
    @Value("${app.admin.email:admin@ist-auth.com}")
    private String adminEmail;
    
    @Value("${app.admin.password:Admin123!}")
    private String adminPassword;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing application data...");
        
        createDefaultRoles();
        createAdminUser();
        oAuthClientService.createDefaultClients();
        budgetService.initializeDefaultBudgetCategories("2024-2025");
        
        logger.info("Application data initialization completed");
    }
    
    private void createDefaultRoles() {
        logger.info("Creating default roles...");
        
        createRoleIfNotExists("ADMIN", "System Administrator with full access");
        createRoleIfNotExists("TEACHER", "Teacher with access to educational resources");
        createRoleIfNotExists("STUDENT", "Student with limited access to learning resources");
        
        logger.info("Default roles created successfully");
    }
    
    private void createRoleIfNotExists(String roleName, String description) {
        if (!roleRepository.existsByName(roleName)) {
            Role role = new Role();
            role.setName(roleName);
            role.setDescription(description);
            roleRepository.save(role);
            logger.info("Created role: {}", roleName);
        } else {
            logger.debug("Role already exists: {}", roleName);
        }
    }
    
    private void createAdminUser() {
        logger.info("Creating admin user...");
        
        if (!userRepository.existsByEmail(adminEmail)) {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
            
            User admin = new User("admin", adminEmail, "System", "Administrator");
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setEmailVerified(true);
            admin.setAccountEnabled(true);
            admin.addRole(adminRole);
            
            userRepository.save(admin);
            logger.info("Admin user created with email: {}", adminEmail);
        } else {
            logger.info("Admin user already exists");
        }
    }
}
