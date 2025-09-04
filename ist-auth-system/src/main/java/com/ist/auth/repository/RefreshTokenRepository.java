package com.ist.auth.repository;

import com.ist.auth.entity.RefreshToken;
import com.ist.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Refresh Token Repository for database operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    
    List<RefreshToken> findByUser(User user);
    
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user = :user AND rt.revoked = false AND rt.expiresAt > :now")
    List<RefreshToken> findValidTokensByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user = :user")
    void revokeAllUserTokens(@Param("user") User user);
    
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :cutoffTime OR rt.revoked = true")
    void deleteExpiredAndRevokedTokens(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.user = :user AND rt.revoked = false")
    long countValidTokensByUser(@Param("user") User user);
}
