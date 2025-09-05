package com.ist.auth.repository;

import com.ist.auth.entity.BudgetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Budget Category Repository for database operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Repository
public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {
    
    Optional<BudgetCategory> findByName(String name);
    
    List<BudgetCategory> findByActive(Boolean active);
    
    List<BudgetCategory> findByDepartment(String department);
    
    List<BudgetCategory> findByAcademicYear(String academicYear);
    
    List<BudgetCategory> findByDepartmentAndAcademicYear(String department, String academicYear);
    
    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.spentAmount > bc.allocatedAmount")
    List<BudgetCategory> findOverBudgetCategories();
    
    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.spentAmount >= (bc.allocatedAmount * :threshold)")
    List<BudgetCategory> findCategoriesNearBudgetLimit(@Param("threshold") BigDecimal threshold);
    
    @Query("SELECT SUM(bc.allocatedAmount) FROM BudgetCategory bc WHERE bc.active = true")
    BigDecimal getTotalAllocatedBudget();
    
    @Query("SELECT SUM(bc.spentAmount) FROM BudgetCategory bc WHERE bc.active = true")
    BigDecimal getTotalSpentBudget();
    
    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.department = :department AND bc.active = true ORDER BY bc.spentAmount DESC")
    List<BudgetCategory> findTopSpendingCategoriesByDepartment(@Param("department") String department);
    
    boolean existsByName(String name);
}
