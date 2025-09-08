package com.ist.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ResendEmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(ResendEmailService.class);
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${resend.api-key:re_eu1yJ2en_C6t9cKQ5dTqSLE3kWmJL1wrq}")
    private String apiKey;
    
    @Value("${app.email.from:onboarding@resend.dev}")
    private String fromEmail;
    
    public boolean sendVerificationEmail(String toEmail, String verificationToken, String baseUrl) {
        logger.info("=== EMAIL SENDING DEBUG ===");
        logger.info("To: {}", toEmail);
        logger.info("API Key: {}...", apiKey != null ? apiKey.substring(0, 10) + "..." : "NULL");
        logger.info("From: {}", fromEmail);
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.error("API key is null or empty!");
            return false;
        }
        
        try {
            String verificationUrl = "https://ist-auth-system-sparkling-wind-9681.fly.dev/api/auth/verify-email?token=" + verificationToken;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Content-Type", "application/json");
            
            Map<String, Object> emailData = Map.of(
                "from", "onboarding@resend.dev",
                "to", new String[]{toEmail},
                "subject", "Verify Your Account",
                "html", "<a href='https://ist-auth-system.vercel.app/auth/verify?token=" + verificationToken + "'>Verify Email</a>"
            );
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailData, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                "https://api.resend.com/emails",
                HttpMethod.POST,
                request,
                String.class
            );
            
            logger.info("=== RESEND API RESPONSE ===");
            logger.info("Status Code: {}", response.getStatusCode());
            logger.info("Response Body: {}", response.getBody());
            logger.info("Email sent successfully!");
            return response.getStatusCode().is2xxSuccessful();
            
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }
    
    private String buildVerificationEmailHtml(String verificationUrl) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb;">IST Authentication System</h1>
                </div>
                
                <h2 style="color: #333;">Welcome! Please verify your email</h2>
                <p>Thank you for registering with IST Authentication System. To complete your registration, please verify your email address.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                        Verify Email Address
                    </a>
                </div>
                
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 4px;">%s</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                    <p>This verification link will expire in 24 hours.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <p style="margin-top: 20px;">
                        Best regards,<br>
                        IST Authentication System Team
                    </p>
                </div>
            </div>
            """.formatted(verificationUrl, verificationUrl);
    }
}