package com.ist.auth.repository;

import com.ist.auth.entity.BudgetExpense;
import com.ist.auth.entity.BudgetCategory;
import com.ist.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Budget Expense Repository for database operations
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Repository
public interface BudgetExpenseRepository extends JpaRepository<BudgetExpense, Long> {
    
    List<BudgetExpense> findByCategory(BudgetCategory category);
    
    List<BudgetExpense> findByStatus(BudgetExpense.ExpenseStatus status);
    
    List<BudgetExpense> findByCreatedBy(User createdBy);
    
    List<BudgetExpense> findByApprovedBy(User approvedBy);
    
    @Query("SELECT be FROM BudgetExpense be WHERE be.expenseDate BETWEEN :startDate AND :endDate")
    List<BudgetExpense> findByExpenseDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT be FROM BudgetExpense be WHERE be.category = :category AND be.expenseDate BETWEEN :startDate AND :endDate")
    List<BudgetExpense> findByCategoryAndExpenseDateBetween(@Param("category") BudgetCategory category, 
                                                           @Param("startDate") LocalDate startDate, 
                                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(be.amount) FROM BudgetExpense be WHERE be.category = :category AND be.status = 'APPROVED'")
    BigDecimal getTotalApprovedAmountByCategory(@Param("category") BudgetCategory category);
    
    @Query("SELECT SUM(be.amount) FROM BudgetExpense be WHERE be.status = 'PENDING'")
    BigDecimal getTotalPendingAmount();
    
    @Query("SELECT be FROM BudgetExpense be WHERE be.amount > :amount ORDER BY be.amount DESC")
    List<BudgetExpense> findExpensesAboveAmount(@Param("amount") BigDecimal amount);
    
    @Query("SELECT COUNT(be) FROM BudgetExpense be WHERE be.status = 'PENDING'")
    long countPendingExpenses();
    
    @Query("SELECT be FROM BudgetExpense be WHERE be.category.department = :department ORDER BY be.createdAt DESC")
    List<BudgetExpense> findByDepartmentOrderByCreatedAtDesc(@Param("department") String department);
}
