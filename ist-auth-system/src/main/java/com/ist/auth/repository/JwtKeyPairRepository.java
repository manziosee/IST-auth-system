package com.ist.auth.repository;

import com.ist.auth.entity.JwtKeyPair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JwtKeyPairRepository extends JpaRepository<JwtKeyPair, Long> {
    Optional<JwtKeyPair> findByActiveTrue();
    Optional<JwtKeyPair> findByKeyId(String keyId);
}