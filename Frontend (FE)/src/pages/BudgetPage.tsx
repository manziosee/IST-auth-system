import { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { budgetService, BudgetCategory, BudgetExpense } from '../services/budgetService';
import { useAuth } from '../contexts/AuthContext';
import { ExpenseForm } from '../components/budget/ExpenseForm';

export function BudgetPage() {
  const { state } = useAuth();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = useState<BudgetExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const [categoriesData, expensesData] = await Promise.all([
          budgetService.getCategories(),
          budgetService.getExpenses()
        ]);
        setCategories(categoriesData);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Failed to fetch budget data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  const handleApproveExpense = async (expenseId: number) => {
    try {
      await budgetService.approveExpense(expenseId);
      // Refresh expenses
      const updatedExpenses = await budgetService.getExpenses();
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Failed to approve expense:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isAdmin = state.user?.roles?.includes('ADMIN');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Track expenses and manage institutional budgets</p>
        </div>
        <div className="flex space-x-3">
          {(state.user?.roles?.includes('TEACHER') || isAdmin) && (
            <Button
              onClick={() => setShowExpenseForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit Expense
            </Button>
          )}
          {isAdmin && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          )}
        </div>
      </div>

      {/* Budget Categories */}
      <Card title="Budget Categories" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {category.isOverBudget && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Allocated:</span>
                  <span className="font-medium">${category.allocatedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Spent:</span>
                  <span className="font-medium">${category.spentAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      category.utilizationPercentage > 90 ? 'bg-red-500' :
                      category.utilizationPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(category.utilizationPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {category.utilizationPercentage.toFixed(1)}% utilized
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Expenses */}
      {isAdmin && (
        <Card title="Pending Expenses" className="p-6">
          <div className="space-y-4">
            {expenses.filter(exp => exp.status === 'PENDING').map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{expense.description}</h3>
                  <p className="text-sm text-gray-600">{expense.category.name}</p>
                  <p className="text-xs text-gray-500">
                    Submitted by {expense.createdBy.username} on {new Date(expense.expenseDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${expense.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{expense.vendor}</div>
                  </div>
                  <Button
                    onClick={() => handleApproveExpense(expense.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
            {expenses.filter(exp => exp.status === 'PENDING').length === 0 && (
              <p className="text-gray-500 text-center py-8">No pending expenses</p>
            )}
          </div>
        </Card>
      )}

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Allocated</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${categories.reduce((sum, cat) => sum + cat.spentAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {categories.filter(cat => cat.isOverBudget).length}
              </div>
              <div className="text-sm text-gray-600">Over Budget</div>
            </div>
          </div>
        </Card>
      </div>

      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSuccess={async () => {
            const updatedExpenses = await budgetService.getExpenses();
            setExpenses(updatedExpenses);
          }}
        />
      )}
    </div>
  );
}