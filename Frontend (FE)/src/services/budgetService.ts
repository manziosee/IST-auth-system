const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ist-auth-system-sparkling-wind-9681.fly.dev/api';

export interface BudgetCategory {
  id: number;
  name: string;
  description: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  department: string;
  academicYear: string;
  active: boolean;
  isOverBudget: boolean;
}

export interface BudgetExpense {
  id: number;
  description: string;
  amount: number;
  expenseDate: string;
  category: {
    id: number;
    name: string;
  };
  vendor: string;
  receiptNumber: string;
  status: string;
  notes: string;
  createdBy: {
    id: number;
    username: string;
  };
  approvedBy?: {
    id: number;
    username: string;
  };
}

class BudgetService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getCategories(): Promise<BudgetCategory[]> {
    const response = await fetch(`${API_BASE}/budget/categories`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch budget categories');
    }
    
    return response.json();
  }

  async createCategory(data: {
    name: string;
    description: string;
    allocatedAmount: number;
    department: string;
    academicYear: string;
  }): Promise<BudgetCategory> {
    const response = await fetch(`${API_BASE}/budget/categories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create budget category');
    }
    
    const result = await response.json();
    return result.category;
  }

  async getExpenses(): Promise<BudgetExpense[]> {
    const response = await fetch(`${API_BASE}/budget/expenses/pending`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    
    return response.json();
  }

  async createExpense(data: {
    description: string;
    amount: number;
    expenseDate: string;
    categoryId: number;
    vendor?: string;
    receiptNumber?: string;
    notes?: string;
  }): Promise<BudgetExpense> {
    const response = await fetch(`${API_BASE}/budget/expenses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    
    const result = await response.json();
    return result.expense;
  }

  async approveExpense(expenseId: number): Promise<BudgetExpense> {
    const response = await fetch(`${API_BASE}/budget/expenses/${expenseId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve expense');
    }
    
    const result = await response.json();
    return result.expense;
  }

  async getBudgetSummary(): Promise<any> {
    const response = await fetch(`${API_BASE}/budget/summary`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch budget summary');
    }
    
    return response.json();
  }
}

export const budgetService = new BudgetService();