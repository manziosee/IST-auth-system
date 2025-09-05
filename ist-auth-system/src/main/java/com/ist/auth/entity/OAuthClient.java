package com.ist.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * OAuth Client entity for client registration and management
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Entity
@Table(name = "oauth_clients", indexes = {
    @Index(name = "idx_client_id", columnList = "client_id")
})
@EntityListeners(AuditingEntityListener.class)
public class OAuthClient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Client ID is required")
    @Column(name = "client_id", unique = true, nullable = false)
    private String clientId;
    
    @NotBlank(message = "Client secret is required")
    @Column(name = "client_secret", nullable = false)
    private String clientSecret;
    
    @NotBlank(message = "Client name is required")
    @Size(max = 100, message = "Client name must not exceed 100 characters")
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "client_redirect_uris", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "redirect_uri")
    private Set<String> redirectUris;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "client_grant_types", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "grant_type")
    private Set<GrantType> grantTypes;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "client_scopes", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "scope")
    private Set<String> scopes;
    
    @Column(name = "access_token_validity")
    private Integer accessTokenValidity = 900; // 15 minutes
    
    @Column(name = "refresh_token_validity")
    private Integer refreshTokenValidity = 604800; // 7 days
    
    @Column(name = "auto_approve", nullable = false)
    private Boolean autoApprove = false;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public OAuthClient() {}
    
    public OAuthClient(String clientId, String clientSecret, String clientName) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.clientName = clientName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    
    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Set<String> getRedirectUris() { return redirectUris; }
    public void setRedirectUris(Set<String> redirectUris) { this.redirectUris = redirectUris; }
    
    public Set<GrantType> getGrantTypes() { return grantTypes; }
    public void setGrantTypes(Set<GrantType> grantTypes) { this.grantTypes = grantTypes; }
    
    public Set<String> getScopes() { return scopes; }
    public void setScopes(Set<String> scopes) { this.scopes = scopes; }
    
    public Integer getAccessTokenValidity() { return accessTokenValidity; }
    public void setAccessTokenValidity(Integer accessTokenValidity) { this.accessTokenValidity = accessTokenValidity; }
    
    public Integer getRefreshTokenValidity() { return refreshTokenValidity; }
    public void setRefreshTokenValidity(Integer refreshTokenValidity) { this.refreshTokenValidity = refreshTokenValidity; }
    
    public Boolean getAutoApprove() { return autoApprove; }
    public void setAutoApprove(Boolean autoApprove) { this.autoApprove = autoApprove; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public boolean isValidRedirectUri(String redirectUri) {
        return redirectUris != null && redirectUris.contains(redirectUri);
    }
    
    public boolean hasGrantType(GrantType grantType) {
        return grantTypes != null && grantTypes.contains(grantType);
    }
    
    public boolean hasScope(String scope) {
        return scopes != null && scopes.contains(scope);
    }
}
