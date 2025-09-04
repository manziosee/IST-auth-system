package com.ist.auth.controller;

import com.ist.auth.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

/**
 * OAuth2 Controller for handling LinkedIn OAuth authentication
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@RestController
@RequestMapping("/oauth2")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class OAuth2Controller {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2Controller.class);
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    @GetMapping("/login/linkedin")
    public RedirectView linkedinLogin() {
        String authUrl = "https://www.linkedin.com/oauth/v2/authorization?" +
                "response_type=code&" +
                "client_id=${spring.security.oauth2.client.registration.linkedin.client-id}&" +
                "redirect_uri=${spring.security.oauth2.client.registration.linkedin.redirect-uri}&" +
                "scope=r_liteprofile%20r_emailaddress";
        
        return new RedirectView(authUrl);
    }
    
    @GetMapping("/success")
    public RedirectView oauthSuccess(OAuth2AuthenticationToken authentication) {
        logger.info("OAuth2 authentication successful");
        
        try {
            OAuth2User oAuth2User = authentication.getPrincipal();
            String registrationId = authentication.getAuthorizedClientRegistrationId();
            
            // Extract user information from LinkedIn
            String email = getEmailFromLinkedIn(authentication);
            String firstName = getFirstNameFromLinkedIn(oAuth2User);
            String lastName = getLastNameFromLinkedIn(oAuth2User);
            String providerId = oAuth2User.getAttribute("id");
            
            if (email == null) {
                logger.error("Email not found in OAuth2 user attributes");
                return new RedirectView(frontendUrl + "/login?error=oauth_email_missing");
            }
            
            // Authenticate or create user
            Map<String, Object> authResponse = authenticationService.authenticateOAuth(
                email, firstName, lastName, providerId, registrationId.toUpperCase()
            );
            
            // Redirect to frontend with tokens
            String redirectUrl = String.format("%s/oauth/callback?access_token=%s&refresh_token=%s",
                frontendUrl,
                authResponse.get("accessToken"),
                authResponse.get("refreshToken")
            );
            
            return new RedirectView(redirectUrl);
            
        } catch (Exception e) {
            logger.error("OAuth2 authentication failed", e);
            return new RedirectView(frontendUrl + "/login?error=oauth_failed");
        }
    }
    
    @GetMapping("/failure")
    public RedirectView oauthFailure(@RequestParam(value = "error", required = false) String error) {
        logger.error("OAuth2 authentication failed with error: {}", error);
        return new RedirectView(frontendUrl + "/login?error=oauth_failed");
    }
    
    private String getEmailFromLinkedIn(OAuth2AuthenticationToken authentication) {
        try {
            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName()
            );
            
            // Make API call to get email
            // This would typically use RestTemplate or WebClient to call LinkedIn's email API
            // For now, we'll try to get it from the user attributes if available
            OAuth2User user = authentication.getPrincipal();
            return user.getAttribute("emailAddress");
            
        } catch (Exception e) {
            logger.error("Failed to get email from LinkedIn", e);
            return null;
        }
    }
    
    private String getFirstNameFromLinkedIn(OAuth2User oAuth2User) {
        try {
            Map<String, Object> firstName = oAuth2User.getAttribute("firstName");
            if (firstName != null) {
                Map<String, Object> localized = (Map<String, Object>) firstName.get("localized");
                if (localized != null) {
                    return (String) localized.get("en_US");
                }
            }
            return "User";
        } catch (Exception e) {
            logger.warn("Failed to extract first name from LinkedIn profile", e);
            return "User";
        }
    }
    
    private String getLastNameFromLinkedIn(OAuth2User oAuth2User) {
        try {
            Map<String, Object> lastName = oAuth2User.getAttribute("lastName");
            if (lastName != null) {
                Map<String, Object> localized = (Map<String, Object>) lastName.get("localized");
                if (localized != null) {
                    return (String) localized.get("en_US");
                }
            }
            return "";
        } catch (Exception e) {
            logger.warn("Failed to extract last name from LinkedIn profile", e);
            return "";
        }
    }
    
    @PostMapping("/linkedin/callback")
    public ResponseEntity<Map<String, Object>> handleLinkedInCallback(@RequestBody LinkedInCallbackRequest request) {
        logger.info("Processing LinkedIn OAuth callback");
        
        try {
            Map<String, Object> authResponse = authenticationService.authenticateOAuth(
                request.email,
                request.firstName,
                request.lastName,
                request.providerId,
                "LINKEDIN"
            );
            
            return ResponseEntity.ok(authResponse);
            
        } catch (Exception e) {
            logger.error("LinkedIn OAuth callback failed", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    public static class LinkedInCallbackRequest {
        public String email;
        public String firstName;
        public String lastName;
        public String providerId;
    }
}
