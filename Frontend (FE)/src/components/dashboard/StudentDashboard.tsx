import { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp, FileText, CheckCircle, Target, Brain, DollarSign, Eye } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { budgetService } from '../../services/budgetService';
import { useAuth } from '../../contexts/AuthContext';

export function StudentDashboard() {
  const { state } = useAuth();
  const [stats, setStats] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch budget data that students can view
        const [categories, summary] = await Promise.all([
          budgetService.getCategories(),
          budgetService.getBudgetSummary()
        ]);
        
        setBudgetCategories(categories);
        setBudgetSummary(summary);
        
        // Build stats from API data (student perspective)
        const studentCategories = categories.filter(cat => 
          cat.name.toLowerCase().includes('student') || 
          cat.name.toLowerCase().includes('scholarship') ||
          cat.name.toLowerCase().includes('activities')
        );
        
        const totalStudentBudget = studentCategories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);
        const avgUtilization = categories.length > 0 ? 
          categories.reduce((sum, cat) => sum + cat.utilizationPercentage, 0) / categories.length : 0;
        
        setStats([
          { title: 'Budget Categories', value: categories.length.toString(), change: 'Available to view', icon: BookOpen, color: 'blue' as const },
          { title: 'Student Programs', value: studentCategories.length.toString(), change: 'Active programs', icon: Target, color: 'orange' as const },
          { title: 'Total Budget', value: `$${categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0).toLocaleString()}`, change: 'Institution budget', icon: DollarSign, color: 'green' as const },
          { title: 'Avg Utilization', value: `${avgUtilization.toFixed(1)}%`, change: 'Budget usage', icon: TrendingUp, color: 'purple' as const },
        ]);
        
      } catch (err) {
        setError('Failed to load student data');
        console.error('Student dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Hub</h1>
          <p className="text-gray-600">Track your academic journey and achieve your goals</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Target className="h-4 w-4" />
            <span>Set Goals</span>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Brain className="h-4 w-4" />
            <span>Study Plan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Budget Overview" className="p-6">
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
                  <p className="text-sm text-gray-600 mt-1">
                    {category.utilizationPercentage.toFixed(1)}% utilized
                  </p>
                </div>
                <div className="text-right">
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
            {budgetCategories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No budget information available</p>
            )}
          </div>
        </Card>

        <Card title="Budget Categories" className="p-6">
          <div className="space-y-4">
            {budgetCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{category.department || 'General Department'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Remaining: ${category.remainingAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${category.spentAmount.toLocaleString()}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    category.isOverBudget ? 'bg-red-100 text-red-800' :
                    category.utilizationPercentage > 75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {category.utilizationPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
            {budgetCategories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No budget categories available</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Institution Budget Summary" className="p-6">
        {budgetSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {budgetCategories.length}
              </div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${budgetCategories.reduce((sum, cat) => sum + cat.allocatedAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Allocated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${budgetCategories.reduce((sum, cat) => sum + cat.spentAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <LoadingSpinner size="md" />
            <p className="text-gray-500 mt-2">Loading budget summary...</p>
          </div>
        )}
      </Card>
    </div>
  );
}