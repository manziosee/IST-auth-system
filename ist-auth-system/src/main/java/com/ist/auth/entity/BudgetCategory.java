package com.ist.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Budget Category Entity for educational budget management
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Entity
@Table(name = "budget_categories")
public class BudgetCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String name;
    
    private String description;
    
    @NotNull
    @PositiveOrZero
    @Column(name = "allocated_amount", precision = 15, scale = 2)
    private BigDecimal allocatedAmount;
    
    @NotNull
    @PositiveOrZero
    @Column(name = "spent_amount", precision = 15, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;
    
    @NotNull
    @Column(name = "active")
    private Boolean active = true;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "academic_year")
    private String academicYear;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<BudgetExpense> expenses = new HashSet<>();
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public BudgetCategory() {}
    
    public BudgetCategory(String name, String description, BigDecimal allocatedAmount) {
        this.name = name;
        this.description = description;
        this.allocatedAmount = allocatedAmount;
    }
    
    // Business methods
    public BigDecimal getRemainingAmount() {
        return allocatedAmount.subtract(spentAmount);
    }
    
    public BigDecimal getUtilizationPercentage() {
        if (allocatedAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return spentAmount.divide(allocatedAmount, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
    
    public boolean isOverBudget() {
        return spentAmount.compareTo(allocatedAmount) > 0;
    }
    
    public boolean isNearBudgetLimit(BigDecimal threshold) {
        BigDecimal utilizationThreshold = allocatedAmount.multiply(threshold);
        return spentAmount.compareTo(utilizationThreshold) >= 0;
    }
    
    public void addExpense(BudgetExpense expense) {
        expenses.add(expense);
        expense.setCategory(this);
        spentAmount = spentAmount.add(expense.getAmount());
    }
    
    public void removeExpense(BudgetExpense expense) {
        expenses.remove(expense);
        expense.setCategory(null);
        spentAmount = spentAmount.subtract(expense.getAmount());
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }
    
    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }
    
    public BigDecimal getSpentAmount() {
        return spentAmount;
    }
    
    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public String getAcademicYear() {
        return academicYear;
    }
    
    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
    
    public Set<BudgetExpense> getExpenses() {
        return expenses;
    }
    
    public void setExpenses(Set<BudgetExpense> expenses) {
        this.expenses = expenses;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
