package com.ist.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Budget Expense Entity for tracking educational expenses
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Entity
@Table(name = "budget_expenses")
public class BudgetExpense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String description;
    
    @NotNull
    @Positive
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @NotNull
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private BudgetCategory category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @Column(name = "vendor")
    private String vendor;
    
    @Column(name = "receipt_number")
    private String receiptNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ExpenseStatus status = ExpenseStatus.PENDING;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    public enum ExpenseStatus {
        PENDING, APPROVED, REJECTED, PAID
    }
    
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
    public BudgetExpense() {}
    
    public BudgetExpense(String description, BigDecimal amount, LocalDate expenseDate, BudgetCategory category, User createdBy) {
        this.description = description;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.category = category;
        this.createdBy = createdBy;
    }
    
    // Business methods
    public void approve(User approver) {
        this.status = ExpenseStatus.APPROVED;
        this.approvedBy = approver;
        this.approvedAt = LocalDateTime.now();
    }
    
    public void reject() {
        this.status = ExpenseStatus.REJECTED;
    }
    
    public void markAsPaid() {
        this.status = ExpenseStatus.PAID;
    }
    
    public boolean isApproved() {
        return status == ExpenseStatus.APPROVED;
    }
    
    public boolean isPending() {
        return status == ExpenseStatus.PENDING;
    }
    
    public boolean isRejected() {
        return status == ExpenseStatus.REJECTED;
    }
    
    public boolean isPaid() {
        return status == ExpenseStatus.PAID;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public LocalDate getExpenseDate() {
        return expenseDate;
    }
    
    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }
    
    public BudgetCategory getCategory() {
        return category;
    }
    
    public void setCategory(BudgetCategory category) {
        this.category = category;
    }
    
    public User getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getVendor() {
        return vendor;
    }
    
    public void setVendor(String vendor) {
        this.vendor = vendor;
    }
    
    public String getReceiptNumber() {
        return receiptNumber;
    }
    
    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }
    
    public ExpenseStatus getStatus() {
        return status;
    }
    
    public void setStatus(ExpenseStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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
    
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}
