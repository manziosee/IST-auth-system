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
    
    @Lob
    @Column(name = "private_key", nullable = false)
    private byte[] privateKey;
    
    @Lob
    @Column(name = "public_key", nullable = false)
    private byte[] publicKey;
    
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
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    
    public byte[] getPrivateKey() { return privateKey; }
    public void setPrivateKey(byte[] privateKey) { this.privateKey = privateKey; }
    
    public byte[] getPublicKey() { return publicKey; }
    public void setPublicKey(byte[] publicKey) { this.publicKey = publicKey; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}