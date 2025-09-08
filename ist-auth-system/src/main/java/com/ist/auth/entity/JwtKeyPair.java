package com.ist.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jwt_key_pairs")
public class JwtKeyPair {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "key_id", unique = true, nullable = false)
    private String keyId;
    
    @Column(name = "private_key", nullable = false, columnDefinition = "TEXT")
    private String privateKey;
    
    @Column(name = "public_key", nullable = false, columnDefinition = "TEXT")
    private String publicKey;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public JwtKeyPair() {}
    
    public JwtKeyPair(String keyId, byte[] privateKey, byte[] publicKey) {
        this.keyId = keyId;
        this.privateKey = java.util.Base64.getEncoder().encodeToString(privateKey);
        this.publicKey = java.util.Base64.getEncoder().encodeToString(publicKey);
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    
    public byte[] getPrivateKey() { 
        return java.util.Base64.getDecoder().decode(privateKey); 
    }
    public void setPrivateKey(byte[] privateKey) { 
        this.privateKey = java.util.Base64.getEncoder().encodeToString(privateKey); 
    }
    
    public byte[] getPublicKey() { 
        return java.util.Base64.getDecoder().decode(publicKey); 
    }
    public void setPublicKey(byte[] publicKey) { 
        this.publicKey = java.util.Base64.getEncoder().encodeToString(publicKey); 
    }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}