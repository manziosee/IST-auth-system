package com.ist.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.beans.factory.annotation.Value;

/**
 * OAuth2 Configuration for LinkedIn integration
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Configuration
public class OAuth2Config {
    
    @Value("${spring.security.oauth2.client.registration.linkedin.client-id}")
    private String linkedinClientId;
    
    @Value("${spring.security.oauth2.client.registration.linkedin.client-secret}")
    private String linkedinClientSecret;
    
    @Value("${spring.security.oauth2.client.registration.linkedin.redirect-uri}")
    private String linkedinRedirectUri;
    
    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(linkedinClientRegistration());
    }
    
    private ClientRegistration linkedinClientRegistration() {
        return ClientRegistration.withRegistrationId("linkedin")
                .clientId(linkedinClientId)
                .clientSecret(linkedinClientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(linkedinRedirectUri)
                .scope("r_liteprofile", "r_emailaddress")
                .authorizationUri("https://www.linkedin.com/oauth/v2/authorization")
                .tokenUri("https://www.linkedin.com/oauth/v2/accessToken")
                .userInfoUri("https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))")
                .userNameAttributeName("id")
                .clientName("LinkedIn")
                .build();
    }
}
