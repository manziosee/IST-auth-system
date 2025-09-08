import { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, Clock, Award, MessageCircle, GraduationCap, CheckCircle, DollarSign } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { budgetService } from '../../services/budgetService';
import { useAuth } from '../../contexts/AuthContext';

export function TeacherDashboard() {
  const { state } = useAuth();
  const [stats, setStats] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        
        // Fetch budget data that teachers can access
        const [categories, pendingExpenses] = await Promise.all([
          budgetService.getCategories(),
          budgetService.getExpenses()
        ]);
        
        setBudgetCategories(categories);
        setExpenses(pendingExpenses);
        
        // Build stats from API data
        const teachingCategories = categories.filter(cat => 
          cat.name.toLowerCase().includes('teaching') || 
          cat.name.toLowerCase().includes('education') ||
          cat.name.toLowerCase().includes('materials')
        );
        
        const totalTeachingBudget = teachingCategories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);
        const myExpenses = pendingExpenses.filter(exp => 
          exp.createdBy.username === state.user?.username
        );
        
        setStats([
          { title: 'Available Categories', value: teachingCategories.length.toString(), change: 'For teaching', icon: BookOpen, color: 'blue' as const },
          { title: 'Teaching Budget', value: `$${totalTeachingBudget.toLocaleString()}`, change: 'Available', icon: DollarSign, color: 'green' as const },
          { title: 'My Expenses', value: myExpenses.length.toString(), change: 'Pending approval', icon: FileText, color: 'orange' as const },
          { title: 'Budget Usage', value: `${teachingCategories.length > 0 ? (teachingCategories.reduce((sum, cat) => sum + cat.utilizationPercentage, 0) / teachingCategories.length).toFixed(1) : 0}%`, change: 'Average utilization', icon: Award, color: 'purple' as const },
        ]);
        
      } catch (err) {
        setError('Failed to load teacher data');
        console.error('Teacher dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [state.user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teaching Center</h1>
          <p className="text-gray-600">Manage courses, grade assignments, and track student progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <GraduationCap className="h-4 w-4" />
            <span>Create Assignment</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>Message Students</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Budget Categories" className="p-6">
          <div className="space-y-4">
            {budgetCategories.slice(0, 4).map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${category.allocatedAmount.toLocaleString()}</span>
                    </span>
                    <span>{category.department || 'General'}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {category.utilizationPercentage.toFixed(1)}% used
                </div>
              </div>
            ))}
            {budgetCategories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No budget categories available</p>
            )}
          </div>
        </Card>

        <Card title="My Expenses" className="p-6">
          <div className="space-y-4">
            {expenses.filter(exp => exp.createdBy.username === state.user?.username).slice(0, 4).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  {expense.status === 'APPROVED' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : expense.status === 'REJECTED' ? (
                    <Clock className="h-5 w-5 text-red-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-600" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{expense.description}</h3>
                    <p className="text-sm text-gray-600">{expense.category.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(expense.expenseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${expense.amount.toLocaleString()}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {expense.status}
                  </span>
                </div>
              </div>
            ))}
            {expenses.filter(exp => exp.createdBy.username === state.user?.username).length === 0 && (
              <p className="text-gray-500 text-center py-4">No expenses submitted yet</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Quick Actions" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Submit Expense</h3>
                <p className="text-sm text-gray-600">Request budget allocation</p>
              </div>
            </div>
          </button>
          <button className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 rounded-lg p-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-600">Budget utilization</p>
              </div>
            </div>
          </button>
          <button className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Budget Categories</h3>
                <p className="text-sm text-gray-600">View available budgets</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}