package com.ist.auth.repository;

import com.ist.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Role Repository for database operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);
    
    boolean existsByName(String name);
}
