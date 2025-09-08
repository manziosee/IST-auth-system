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
        String clientId = "77p4t5kqfgi1qi";
        String redirectUri = "https://ist-auth-system.vercel.app/oauth/callback";
        String scope = "openid profile email";
        String state = "linkedin_oauth_" + System.currentTimeMillis();
        
        String linkedinAuthUrl = "https://www.linkedin.com/oauth/v2/authorization" +
            "?response_type=code" +
            "&client_id=" + clientId +
            "&redirect_uri=" + redirectUri +
            "&scope=" + scope +
            "&state=" + state;
        
        return new RedirectView(linkedinAuthUrl);
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