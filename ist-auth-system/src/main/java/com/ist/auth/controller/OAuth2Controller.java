package com.ist.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

/**
 * OAuth2 Controller for LinkedIn integration
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@RestController
@RequestMapping("/oauth2")
public class OAuth2Controller {
    
    @GetMapping("/login/linkedin")
    public RedirectView linkedinLogin() {
        // For demo purposes, redirect to frontend with mock success
        // In production, this would integrate with LinkedIn OAuth2
        String frontendUrl = "https://ist-auth-system.vercel.app/oauth/callback";
        String mockTokens = "?access_token=mock_linkedin_token&refresh_token=mock_refresh_token&provider=linkedin";
        
        return new RedirectView(frontendUrl + mockTokens);
    }
    
    @GetMapping("/success")
    public RedirectView oauthSuccess() {
        return new RedirectView("https://ist-auth-system.vercel.app/dashboard");
    }
    
    @GetMapping("/failure")
    public RedirectView oauthFailure() {
        return new RedirectView("https://ist-auth-system.vercel.app/auth?error=oauth_failed");
    }
}