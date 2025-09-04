package com.ist.auth.repository;

import com.ist.auth.entity.OAuthClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * OAuth Client Repository for database operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Repository
public interface OAuthClientRepository extends JpaRepository<OAuthClient, Long> {
    
    Optional<OAuthClient> findByClientId(String clientId);
    
    @Query("SELECT c FROM OAuthClient c WHERE c.clientId = :clientId AND c.active = true")
    Optional<OAuthClient> findActiveByClientId(@Param("clientId") String clientId);
    
    List<OAuthClient> findByActive(Boolean active);
    
    boolean existsByClientId(String clientId);
    
    @Query("SELECT c FROM OAuthClient c WHERE c.clientName LIKE %:name%")
    List<OAuthClient> findByClientNameContaining(@Param("name") String name);
}
