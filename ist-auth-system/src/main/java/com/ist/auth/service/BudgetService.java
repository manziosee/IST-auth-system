package com.ist.auth.service;

import com.ist.auth.entity.BudgetCategory;
import com.ist.auth.entity.BudgetExpense;
import com.ist.auth.entity.User;
import com.ist.auth.repository.BudgetCategoryRepository;
import com.ist.auth.repository.BudgetExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Budget Service for educational budget management
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 */
@Service
@Transactional
public class BudgetService {
    
    private static final Logger logger = LoggerFactory.getLogger(BudgetService.class);
    
    @Autowired
    private BudgetCategoryRepository categoryRepository;
    
    @Autowired
    private BudgetExpenseRepository expenseRepository;
    
    // Budget Category Management
    public BudgetCategory createCategory(String name, String description, BigDecimal allocatedAmount, 
                                       String department, String academicYear) {
        logger.info("Creating budget category: {}", name);
        
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Budget category with name " + name + " already exists");
        }
        
        BudgetCategory category = new BudgetCategory(name, description, allocatedAmount);
        category.setDepartment(department);
        category.setAcademicYear(academicYear);
        
        BudgetCategory savedCategory = categoryRepository.save(category);
        logger.info("Budget category created successfully: {}", savedCategory.getId());
        
        return savedCategory;
    }
    
    public BudgetCategory updateCategory(Long categoryId, String name, String description, 
                                       BigDecimal allocatedAmount, String department, String academicYear) {
        logger.info("Updating budget category: {}", categoryId);
        
        BudgetCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Budget category not found"));
        
        category.setName(name);
        category.setDescription(description);
        category.setAllocatedAmount(allocatedAmount);
        category.setDepartment(department);
        category.setAcademicYear(academicYear);
        
        return categoryRepository.save(category);
    }
    
    public void deactivateCategory(Long categoryId) {
        logger.info("Deactivating budget category: {}", categoryId);
        
        BudgetCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Budget category not found"));
        
        category.setActive(false);
        categoryRepository.save(category);
    }
    
    public List<BudgetCategory> getAllActiveCategories() {
        return categoryRepository.findByActive(true);
    }
    
    public List<BudgetCategory> getCategoriesByDepartment(String department) {
        return categoryRepository.findByDepartment(department);
    }
    
    public List<BudgetCategory> getCategoriesByAcademicYear(String academicYear) {
        return categoryRepository.findByAcademicYear(academicYear);
    }
    
    public Optional<BudgetCategory> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }
    
    // Expense Management
    public BudgetExpense createExpense(String description, BigDecimal amount, LocalDate expenseDate,
                                     Long categoryId, String vendor, String receiptNumber, 
                                     String notes, User createdBy) {
        logger.info("Creating budget expense: {}", description);
        
        BudgetCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Budget category not found"));
        
        BudgetExpense expense = new BudgetExpense(description, amount, expenseDate, category, createdBy);
        expense.setVendor(vendor);
        expense.setReceiptNumber(receiptNumber);
        expense.setNotes(notes);
        
        BudgetExpense savedExpense = expenseRepository.save(expense);
        
        // Update category spent amount
        category.setSpentAmount(category.getSpentAmount().add(amount));
        categoryRepository.save(category);
        
        logger.info("Budget expense created successfully: {}", savedExpense.getId());
        return savedExpense;
    }
    
    public BudgetExpense approveExpense(Long expenseId, User approver) {
        logger.info("Approving expense: {}", expenseId);
        
        BudgetExpense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        expense.approve(approver);
        return expenseRepository.save(expense);
    }
    
    public BudgetExpense rejectExpense(Long expenseId) {
        logger.info("Rejecting expense: {}", expenseId);
        
        BudgetExpense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        expense.reject();
        return expenseRepository.save(expense);
    }
    
    public BudgetExpense markExpenseAsPaid(Long expenseId) {
        logger.info("Marking expense as paid: {}", expenseId);
        
        BudgetExpense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        expense.markAsPaid();
        return expenseRepository.save(expense);
    }
    
    public List<BudgetExpense> getPendingExpenses() {
        return expenseRepository.findByStatus(BudgetExpense.ExpenseStatus.PENDING);
    }
    
    public List<BudgetExpense> getExpensesByCategory(Long categoryId) {
        BudgetCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Budget category not found"));
        return expenseRepository.findByCategory(category);
    }
    
    public List<BudgetExpense> getExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByExpenseDateBetween(startDate, endDate);
    }
    
    public List<BudgetExpense> getExpensesByUser(User user) {
        return expenseRepository.findByCreatedBy(user);
    }
    
    // Budget Analytics and Reporting
    public Map<String, Object> getBudgetSummary() {
        logger.debug("Generating budget summary");
        
        Map<String, Object> summary = new HashMap<>();
        
        BigDecimal totalAllocated = categoryRepository.getTotalAllocatedBudget();
        BigDecimal totalSpent = categoryRepository.getTotalSpentBudget();
        BigDecimal totalPending = expenseRepository.getTotalPendingAmount();
        
        summary.put("totalAllocated", totalAllocated != null ? totalAllocated : BigDecimal.ZERO);
        summary.put("totalSpent", totalSpent != null ? totalSpent : BigDecimal.ZERO);
        summary.put("totalPending", totalPending != null ? totalPending : BigDecimal.ZERO);
        summary.put("totalRemaining", totalAllocated != null && totalSpent != null ? 
                   totalAllocated.subtract(totalSpent) : BigDecimal.ZERO);
        summary.put("utilizationPercentage", totalAllocated != null && totalAllocated.compareTo(BigDecimal.ZERO) > 0 ?
                   totalSpent.divide(totalAllocated, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)) : 
                   BigDecimal.ZERO);
        summary.put("pendingExpensesCount", expenseRepository.countPendingExpenses());
        
        return summary;
    }
    
    public List<BudgetCategory> getOverBudgetCategories() {
        return categoryRepository.findOverBudgetCategories();
    }
    
    public List<BudgetCategory> getCategoriesNearBudgetLimit(BigDecimal threshold) {
        return categoryRepository.findCategoriesNearBudgetLimit(threshold);
    }
    
    public Map<String, Object> getDepartmentBudgetSummary(String department) {
        logger.debug("Generating budget summary for department: {}", department);
        
        List<BudgetCategory> categories = categoryRepository.findByDepartment(department);
        
        BigDecimal totalAllocated = categories.stream()
                .map(BudgetCategory::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalSpent = categories.stream()
                .map(BudgetCategory::getSpentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("department", department);
        summary.put("totalAllocated", totalAllocated);
        summary.put("totalSpent", totalSpent);
        summary.put("totalRemaining", totalAllocated.subtract(totalSpent));
        summary.put("utilizationPercentage", totalAllocated.compareTo(BigDecimal.ZERO) > 0 ?
                   totalSpent.divide(totalAllocated, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)) : 
                   BigDecimal.ZERO);
        summary.put("categoriesCount", categories.size());
        summary.put("overBudgetCategories", categories.stream().filter(BudgetCategory::isOverBudget).count());
        
        return summary;
    }
    
    public Map<String, Object> getMonthlyExpenseReport(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        List<BudgetExpense> expenses = expenseRepository.findByExpenseDateBetween(startDate, endDate);
        
        BigDecimal totalAmount = expenses.stream()
                .map(BudgetExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("month", month);
        report.put("totalExpenses", expenses.size());
        report.put("totalAmount", totalAmount);
        report.put("approvedExpenses", expenses.stream().filter(BudgetExpense::isApproved).count());
        report.put("pendingExpenses", expenses.stream().filter(BudgetExpense::isPending).count());
        report.put("rejectedExpenses", expenses.stream().filter(BudgetExpense::isRejected).count());
        
        return report;
    }
    
    public List<BudgetExpense> getHighValueExpenses(BigDecimal threshold) {
        return expenseRepository.findExpensesAboveAmount(threshold);
    }
    
    public void initializeDefaultBudgetCategories(String academicYear) {
        logger.info("Initializing default budget categories for academic year: {}", academicYear);
        
        createDefaultCategoryIfNotExists("Teaching Materials", "Books, supplies, and educational resources", 
                                        new BigDecimal("50000"), "Academic", academicYear);
        createDefaultCategoryIfNotExists("Technology", "Computers, software, and IT equipment", 
                                        new BigDecimal("75000"), "IT", academicYear);
        createDefaultCategoryIfNotExists("Infrastructure", "Building maintenance and improvements", 
                                        new BigDecimal("100000"), "Facilities", academicYear);
        createDefaultCategoryIfNotExists("Staff Development", "Training and professional development", 
                                        new BigDecimal("25000"), "HR", academicYear);
        createDefaultCategoryIfNotExists("Student Activities", "Events, trips, and extracurricular activities", 
                                        new BigDecimal("30000"), "Student Affairs", academicYear);
        
        logger.info("Default budget categories initialized successfully");
    }
    
    private void createDefaultCategoryIfNotExists(String name, String description, BigDecimal amount, 
                                                String department, String academicYear) {
        if (!categoryRepository.existsByName(name)) {
            createCategory(name, description, amount, department, academicYear);
        }
    }
}
