package com.ist.auth.controller;

import com.ist.auth.entity.BudgetCategory;
import com.ist.auth.entity.BudgetExpense;
import com.ist.auth.entity.User;
import com.ist.auth.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Budget Controller for educational budget management endpoints
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@RestController
@RequestMapping("/budget")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://ist-auth-system.vercel.app"})
public class BudgetController {
    
    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    
    @Autowired
    private BudgetService budgetService;
    
    // Budget Category Endpoints
    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        logger.info("Creating budget category: {}", request.name);
        
        try {
            BudgetCategory category = budgetService.createCategory(
                request.name, request.description, request.allocatedAmount,
                request.department, request.academicYear
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Budget category created successfully",
                "category", buildCategoryResponse(category)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to create budget category: {}", request.name, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable Long categoryId,
                                                            @Valid @RequestBody UpdateCategoryRequest request) {
        logger.info("Updating budget category: {}", categoryId);
        
        try {
            BudgetCategory category = budgetService.updateCategory(
                categoryId, request.name, request.description, request.allocatedAmount,
                request.department, request.academicYear
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Budget category updated successfully",
                "category", buildCategoryResponse(category)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to update budget category: {}", categoryId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deactivateCategory(@PathVariable Long categoryId) {
        logger.info("Deactivating budget category: {}", categoryId);
        
        try {
            budgetService.deactivateCategory(categoryId);
            return ResponseEntity.ok(Map.of("message", "Budget category deactivated successfully"));
            
        } catch (Exception e) {
            logger.error("Failed to deactivate budget category: {}", categoryId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        logger.debug("Fetching all active budget categories");
        
        List<BudgetCategory> categories = budgetService.getAllActiveCategories();
        List<Map<String, Object>> response = categories.stream()
                .map(this::buildCategoryResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/categories/department/{department}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Map<String, Object>>> getCategoriesByDepartment(@PathVariable String department) {
        logger.debug("Fetching budget categories for department: {}", department);
        
        List<BudgetCategory> categories = budgetService.getCategoriesByDepartment(department);
        List<Map<String, Object>> response = categories.stream()
                .map(this::buildCategoryResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    // Expense Endpoints
    @PostMapping("/expenses")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> createExpense(@Valid @RequestBody CreateExpenseRequest request,
                                                           @AuthenticationPrincipal User currentUser) {
        logger.info("Creating budget expense: {}", request.description);
        
        try {
            BudgetExpense expense = budgetService.createExpense(
                request.description, request.amount, request.expenseDate,
                request.categoryId, request.vendor, request.receiptNumber,
                request.notes, currentUser
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Budget expense created successfully",
                "expense", buildExpenseResponse(expense)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to create budget expense: {}", request.description, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/expenses/{expenseId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> approveExpense(@PathVariable Long expenseId,
                                                            @AuthenticationPrincipal User currentUser) {
        logger.info("Approving expense: {}", expenseId);
        
        try {
            BudgetExpense expense = budgetService.approveExpense(expenseId, currentUser);
            return ResponseEntity.ok(Map.of(
                "message", "Expense approved successfully",
                "expense", buildExpenseResponse(expense)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to approve expense: {}", expenseId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/expenses/{expenseId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> rejectExpense(@PathVariable Long expenseId) {
        logger.info("Rejecting expense: {}", expenseId);
        
        try {
            BudgetExpense expense = budgetService.rejectExpense(expenseId);
            return ResponseEntity.ok(Map.of(
                "message", "Expense rejected successfully",
                "expense", buildExpenseResponse(expense)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to reject expense: {}", expenseId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/expenses/{expenseId}/mark-paid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> markExpenseAsPaid(@PathVariable Long expenseId) {
        logger.info("Marking expense as paid: {}", expenseId);
        
        try {
            BudgetExpense expense = budgetService.markExpenseAsPaid(expenseId);
            return ResponseEntity.ok(Map.of(
                "message", "Expense marked as paid successfully",
                "expense", buildExpenseResponse(expense)
            ));
            
        } catch (Exception e) {
            logger.error("Failed to mark expense as paid: {}", expenseId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/expenses/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Map<String, Object>>> getPendingExpenses() {
        logger.debug("Fetching pending expenses");
        
        List<BudgetExpense> expenses = budgetService.getPendingExpenses();
        List<Map<String, Object>> response = expenses.stream()
                .map(this::buildExpenseResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/expenses/category/{categoryId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Map<String, Object>>> getExpensesByCategory(@PathVariable Long categoryId) {
        logger.debug("Fetching expenses for category: {}", categoryId);
        
        try {
            List<BudgetExpense> expenses = budgetService.getExpensesByCategory(categoryId);
            List<Map<String, Object>> response = expenses.stream()
                    .map(this::buildExpenseResponse)
                    .toList();
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch expenses for category: {}", categoryId, e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/expenses/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Map<String, Object>>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        logger.debug("Fetching expenses between {} and {}", startDate, endDate);
        
        List<BudgetExpense> expenses = budgetService.getExpensesByDateRange(startDate, endDate);
        List<Map<String, Object>> response = expenses.stream()
                .map(this::buildExpenseResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    // Analytics and Reporting Endpoints
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getBudgetSummary() {
        logger.debug("Fetching budget summary");
        
        Map<String, Object> summary = budgetService.getBudgetSummary();
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/summary/department/{department}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getDepartmentBudgetSummary(@PathVariable String department) {
        logger.debug("Fetching budget summary for department: {}", department);
        
        Map<String, Object> summary = budgetService.getDepartmentBudgetSummary(department);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/categories/over-budget")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getOverBudgetCategories() {
        logger.debug("Fetching over-budget categories");
        
        List<BudgetCategory> categories = budgetService.getOverBudgetCategories();
        List<Map<String, Object>> response = categories.stream()
                .map(this::buildCategoryResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/report/monthly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getMonthlyExpenseReport(
            @RequestParam int year,
            @RequestParam int month) {
        
        logger.debug("Generating monthly expense report for {}/{}", year, month);
        
        Map<String, Object> report = budgetService.getMonthlyExpenseReport(year, month);
        return ResponseEntity.ok(report);
    }
    
    // Helper methods
    private Map<String, Object> buildCategoryResponse(BudgetCategory category) {
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", category.getId());
        response.put("name", category.getName());
        response.put("description", category.getDescription() != null ? category.getDescription() : "");
        response.put("allocatedAmount", category.getAllocatedAmount());
        response.put("spentAmount", category.getSpentAmount());
        response.put("remainingAmount", category.getRemainingAmount());
        response.put("utilizationPercentage", category.getUtilizationPercentage());
        response.put("department", category.getDepartment() != null ? category.getDepartment() : "");
        response.put("academicYear", category.getAcademicYear() != null ? category.getAcademicYear() : "");
        response.put("active", category.getActive());
        response.put("isOverBudget", category.isOverBudget());
        response.put("createdAt", category.getCreatedAt());
        response.put("updatedAt", category.getUpdatedAt());
        return response;
    }
    
    private Map<String, Object> buildExpenseResponse(BudgetExpense expense) {
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", expense.getId());
        response.put("description", expense.getDescription());
        response.put("amount", expense.getAmount());
        response.put("expenseDate", expense.getExpenseDate());
        
        Map<String, Object> categoryMap = new java.util.HashMap<>();
        categoryMap.put("id", expense.getCategory().getId());
        categoryMap.put("name", expense.getCategory().getName());
        response.put("category", categoryMap);
        
        response.put("vendor", expense.getVendor() != null ? expense.getVendor() : "");
        response.put("receiptNumber", expense.getReceiptNumber() != null ? expense.getReceiptNumber() : "");
        response.put("status", expense.getStatus().toString());
        response.put("notes", expense.getNotes() != null ? expense.getNotes() : "");
        
        Map<String, Object> createdByMap = new java.util.HashMap<>();
        createdByMap.put("id", expense.getCreatedBy().getId());
        createdByMap.put("username", expense.getCreatedBy().getUsername());
        response.put("createdBy", createdByMap);
        
        if (expense.getApprovedBy() != null) {
            Map<String, Object> approvedByMap = new java.util.HashMap<>();
            approvedByMap.put("id", expense.getApprovedBy().getId());
            approvedByMap.put("username", expense.getApprovedBy().getUsername());
            response.put("approvedBy", approvedByMap);
        } else {
            response.put("approvedBy", null);
        }
        
        response.put("createdAt", expense.getCreatedAt());
        response.put("updatedAt", expense.getUpdatedAt());
        response.put("approvedAt", expense.getApprovedAt());
        
        return response;
    }
    
    // Request DTOs
    public static class CreateCategoryRequest {
        @NotBlank(message = "Category name is required")
        public String name;
        
        public String description;
        
        @NotNull(message = "Allocated amount is required")
        @PositiveOrZero(message = "Allocated amount must be positive or zero")
        public BigDecimal allocatedAmount;
        
        public String department;
        public String academicYear;
    }
    
    public static class UpdateCategoryRequest {
        @NotBlank(message = "Category name is required")
        public String name;
        
        public String description;
        
        @NotNull(message = "Allocated amount is required")
        @PositiveOrZero(message = "Allocated amount must be positive or zero")
        public BigDecimal allocatedAmount;
        
        public String department;
        public String academicYear;
    }
    
    public static class CreateExpenseRequest {
        @NotBlank(message = "Description is required")
        public String description;
        
        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        public BigDecimal amount;
        
        @NotNull(message = "Expense date is required")
        public LocalDate expenseDate;
        
        @NotNull(message = "Category ID is required")
        public Long categoryId;
        
        public String vendor;
        public String receiptNumber;
        public String notes;
    }
}
