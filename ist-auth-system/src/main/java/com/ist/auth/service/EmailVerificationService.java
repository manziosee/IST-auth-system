package com.ist.auth.service;

import com.ist.auth.entity.EmailVerificationToken;
import com.ist.auth.entity.User;
import com.ist.auth.repository.EmailVerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Email Verification Service for handling email verification workflow
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class EmailVerificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);
    
    @Autowired
    private EmailVerificationTokenRepository tokenRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.email.verification.expiration-hours:24}")
    private int verificationExpirationHours;
    
    @Value("${app.email.from:noreply@ist-auth.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    public EmailVerificationToken generateVerificationToken(User user) {
        logger.debug("Generating email verification token for user: {}", user.getEmail());
        
        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);
        
        String token = UUID.randomUUID().toString();
        
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(verificationExpirationHours));
        verificationToken.setUsed(false);
        
        EmailVerificationToken savedToken = tokenRepository.save(verificationToken);
        logger.debug("Email verification token generated for user: {}", user.getEmail());
        
        return savedToken;
    }
    
    public void sendVerificationEmail(User user) {
        logger.info("Sending verification email to: {}", user.getEmail());
        
        EmailVerificationToken token = generateVerificationToken(user);
        String verificationUrl = frontendUrl + "/verify-email?token=" + token.getToken();
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("IST Auth System - Email Verification");
            message.setText(buildVerificationEmailContent(user, verificationUrl));
            
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", user.getEmail());
            
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    private String buildVerificationEmailContent(User user, String verificationUrl) {
        return String.format("""
            Dear %s,
            
            Welcome to IST Authentication System!
            
            Please click the link below to verify your email address:
            %s
            
            This link will expire in %d hours.
            
            If you didn't create an account with us, please ignore this email.
            
            Best regards,
            IST Auth System Team
            
            ---
            This is an automated message, please do not reply to this email.
            """, 
            user.getFirstName() != null ? user.getFirstName() : user.getUsername(),
            verificationUrl,
            verificationExpirationHours
        );
    }
    
    public boolean verifyEmail(String token) {
        logger.debug("Attempting to verify email with token: {}", token);
        
        Optional<EmailVerificationToken> tokenOpt = tokenRepository.findValidToken(token, LocalDateTime.now());
        
        if (tokenOpt.isEmpty()) {
            logger.warn("Invalid or expired verification token: {}", token);
            return false;
        }
        
        EmailVerificationToken verificationToken = tokenOpt.get();
        User user = verificationToken.getUser();
        
        // Mark token as used
        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);
        
        // Verify user email
        userService.verifyEmail(user);
        
        logger.info("Email verified successfully for user: {}", user.getEmail());
        return true;
    }
    
    public boolean isValidToken(String token) {
        return tokenRepository.findValidToken(token, LocalDateTime.now()).isPresent();
    }
    
    public Optional<EmailVerificationToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }
    
    public void resendVerificationEmail(String email) {
        logger.info("Resending verification email to: {}", email);
        
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        
        User user = userOpt.get();
        
        if (user.getEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }
        
        sendVerificationEmail(user);
    }
    
    public void resendVerificationEmail(User user) {
        if (user.getEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }
        
        sendVerificationEmail(user);
    }
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupExpiredTokens() {
        logger.debug("Running scheduled cleanup of expired email verification tokens");
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(1);
        tokenRepository.deleteExpiredAndUsedTokens(cutoffTime);
        
        logger.debug("Expired email verification tokens cleanup completed");
    }
    
    public long getTokenExpirationHours() {
        return verificationExpirationHours;
    }
    
    public boolean hasValidToken(User user) {
        Optional<EmailVerificationToken> tokenOpt = tokenRepository.findByUser(user);
        
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        EmailVerificationToken token = tokenOpt.get();
        return !token.getUsed() && token.getExpiresAt().isAfter(LocalDateTime.now());
    }
    
    public void invalidateUserTokens(User user) {
        logger.debug("Invalidating all verification tokens for user: {}", user.getEmail());
        tokenRepository.deleteByUser(user);
    }
}
