package com.ist.auth.repository;

import com.ist.auth.entity.EmailVerificationToken;
import com.ist.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Email Verification Token Repository
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    
    Optional<EmailVerificationToken> findByToken(String token);
    
    Optional<EmailVerificationToken> findByUser(User user);
    
    @Query("SELECT evt FROM EmailVerificationToken evt WHERE evt.token = :token AND evt.used = false AND evt.expiresAt > :now")
    Optional<EmailVerificationToken> findValidToken(@Param("token") String token, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM EmailVerificationToken evt WHERE evt.expiresAt < :cutoffTime OR evt.used = true")
    void deleteExpiredAndUsedTokens(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    void deleteByUser(User user);
}
