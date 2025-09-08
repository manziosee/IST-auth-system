package com.ist.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class GmailEmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(GmailEmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    public boolean sendVerificationEmail(String toEmail, String verificationToken, String baseUrl) {
        logger.info("Sending verification email to: {}", toEmail);
        
        try {
            String verificationUrl = "https://ist-auth-system.vercel.app/auth/verify?token=" + verificationToken;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Verify Your IST Auth Account");
            message.setText("Click here to verify your email: " + verificationUrl);
            message.setFrom("manziosee3@gmail.com");
            
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", toEmail);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }
}