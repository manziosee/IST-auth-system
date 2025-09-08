import { useState, useEffect } from 'react';
import { Users, DollarSign, School, Calendar, Building2, UserCheck, Shield, Database, Settings, AlertTriangle } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { budgetService } from '../../services/budgetService';

export function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch budget data from API
        const [categories, summary] = await Promise.all([
          budgetService.getCategories(),
          budgetService.getBudgetSummary()
        ]);
        
        setBudgetCategories(categories);
        setBudgetSummary(summary);
        
        // Build stats from API data
        const totalBudget = categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);
        const totalSpent = categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
        const utilizationRate = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;
        
        setStats([
          { title: 'Budget Categories', value: categories.length.toString(), change: 'Active categories', icon: School, color: 'blue' as const },
          { title: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, change: 'Allocated', icon: DollarSign, color: 'green' as const },
          { title: 'Budget Utilization', value: `${utilizationRate}%`, change: 'Current usage', icon: Database, color: 'purple' as const },
          { title: 'Over Budget', value: categories.filter(cat => cat.isOverBudget).length.toString(), change: 'Categories', icon: AlertTriangle, color: 'red' as const },
        ]);
        
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600">Manage institution infrastructure and budgets</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <UserCheck className="h-4 w-4" />
            <span>Add User</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            <span>Security</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activities" className="p-6">
          <div className="space-y-4">
            {budgetSummary && (
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Budget system initialized</p>
                    <p className="text-sm text-gray-500">System • Active</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {budgetCategories.length} budget categories active
                    </p>
                    <p className="text-sm text-gray-500">Budget Module • Live data</p>
                  </div>
                </div>
                {budgetCategories.some(cat => cat.isOverBudget) && (
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {budgetCategories.filter(cat => cat.isOverBudget).length} categories over budget
                      </p>
                      <p className="text-sm text-gray-500">Alert System • Requires attention</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!budgetSummary && (
              <p className="text-gray-500 text-center py-4">Loading activities...</p>
            )}
          </div>
        </Card>

        <Card title="Budget Categories" className="p-6">
          <div className="space-y-4">
            {budgetCategories.slice(0, 5).map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">
                    ${category.spentAmount.toLocaleString()} / ${category.allocatedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      category.utilizationPercentage > 90 ? 'bg-red-500' : 
                      category.utilizationPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{width: `${Math.min(category.utilizationPercentage, 100)}%`}}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {category.utilizationPercentage.toFixed(1)}% utilized
                  {category.isOverBudget && <span className="text-red-500 ml-2">Over Budget!</span>}
                </div>
              </div>
            ))}
            {budgetCategories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No budget categories found</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Administrative Tools" className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group">
            <School className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Institution Settings</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Academic Calendar</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group">
            <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Facility Management</span>
          </button>
          <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors group">
            <Shield className="h-8 w-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Security Center</span>
          </button>
        </div>
      </Card>
    </div>
  );
}