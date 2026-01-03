import React, { useState, useEffect } from 'react';
import {
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiDownload,
  FiFilter
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BudgetChart = ({ 
  data, 
  type = 'pie',
  title = 'Budget Breakdown',
  showControls = true,
  onExport
}) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample data if none provided
  const defaultData = {
    total: 50000,
    spent: 32000,
    remaining: 18000,
    categories: [
      { name: 'Accommodation', spent: 12000, budget: 15000, color: '#1b5e20' },
      { name: 'Transportation', spent: 8000, budget: 10000, color: '#2e7d32' },
      { name: 'Food', spent: 6000, budget: 8000, color: '#43a047' },
      { name: 'Activities', spent: 4000, budget: 7000, color: '#66bb6a' },
      { name: 'Shopping', spent: 2000, budget: 5000, color: '#81c784' },
      { name: 'Miscellaneous', spent: 1000, budget: 5000, color: '#a5d6a7' },
    ],
    dailySpending: [
      { day: 'Day 1', spent: 5000 },
      { day: 'Day 2', spent: 4500 },
      { day: 'Day 3', spent: 3800 },
      { day: 'Day 4', spent: 5200 },
      { day: 'Day 5', spent: 4100 },
      { day: 'Day 6', spent: 4700 },
      { day: 'Day 7', spent: 4300 },
    ]
  };

  const chartData = data || defaultData;

  // Pie Chart Data
  const pieChartData = {
    labels: chartData.categories.map(cat => cat.name),
    datasets: [
      {
        data: chartData.categories.map(cat => cat.spent),
        backgroundColor: chartData.categories.map(cat => cat.color),
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  // Bar Chart Data
  const barChartData = {
    labels: chartData.categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Spent',
        data: chartData.categories.map(cat => cat.spent),
        backgroundColor: chartData.categories.map(cat => cat.color),
        borderColor: chartData.categories.map(cat => cat.color),
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Budget',
        data: chartData.categories.map(cat => cat.budget),
        backgroundColor: chartData.categories.map(cat => `${cat.color}33`),
        borderColor: chartData.categories.map(cat => cat.color),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Line Chart Data (Daily Spending)
  const lineChartData = {
    labels: chartData.dailySpending.map(day => day.day),
    datasets: [
      {
        label: 'Daily Spending',
        data: chartData.dailySpending.map(day => day.spent),
        borderColor: '#1b5e20',
        backgroundColor: 'rgba(27, 94, 32, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: chartType === 'pie' ? 'right' : 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  const getChartComponent = () => {
    switch (chartType) {
      case 'pie':
        return <Pie data={pieChartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={barChartData} options={barChartOptions} />;
      case 'line':
        return <Line data={lineChartData} options={lineChartOptions} />;
      default:
        return <Pie data={pieChartData} options={chartOptions} />;
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(chartData);
    } else {
      // Default export behavior
      const csvContent = [
        ['Category', 'Spent', 'Budget', 'Remaining'],
        ...chartData.categories.map(cat => [
          cat.name,
          cat.spent,
          cat.budget,
          cat.budget - cat.spent
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'budget-report.csv';
      a.click();
    }
  };

  const percentageSpent = chartData.total > 0 
    ? Math.round((chartData.spent / chartData.total) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gt-primary"></div>
              <span className="text-sm text-gray-600">Total: ₹{chartData.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gt-secondary"></div>
              <span className="text-sm text-gray-600">Spent: ₹{chartData.spent.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Remaining: ₹{chartData.remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {showControls && (
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('pie')}
                className={`p-2 rounded ${chartType === 'pie' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                title="Pie Chart"
              >
                <FiPieChart className={chartType === 'pie' ? 'text-gt-primary' : 'text-gray-500'} />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded ${chartType === 'bar' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                title="Bar Chart"
              >
                <FiBarChart2 className={chartType === 'bar' ? 'text-gt-primary' : 'text-gray-500'} />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded ${chartType === 'line' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                title="Line Chart"
              >
                <FiTrendingUp className={chartType === 'line' ? 'text-gt-primary' : 'text-gray-500'} />
              </button>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>

            <button
              onClick={handleExport}
              className="p-2 text-gray-500 hover:text-gt-primary hover:bg-gray-100 rounded-lg transition"
              title="Export Data"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
          <span className="text-sm font-bold text-gt-primary">{percentageSpent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gt-primary to-gt-accent rounded-full transition-all duration-500"
            style={{ width: `${percentageSpent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹{chartData.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 mb-6">
        {getChartComponent()}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gt-bg-section p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">Daily Average</h4>
            <FiTrendingUp className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ₹{Math.round(chartData.spent / 7).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Per day</div>
        </div>

        <div className="bg-gt-bg-section p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">Remaining/Day</h4>
            <FiTrendingDown className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ₹{Math.round(chartData.remaining / 7).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Daily budget left</div>
        </div>

        <div className="bg-gt-bg-section p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">Savings</h4>
            <FiDollarSign className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            ₹{chartData.categories.reduce((sum, cat) => sum + Math.max(0, cat.budget - cat.spent), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Under budget categories</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {selectedCategory ? (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">{selectedCategory.name} Details</h4>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Show All
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Budget Allocated</span>
              <span className="font-semibold">₹{selectedCategory.budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Spent</span>
              <span className="font-semibold">₹{selectedCategory.spent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining</span>
              <span className={`font-semibold ${
                selectedCategory.budget - selectedCategory.spent >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ₹{(selectedCategory.budget - selectedCategory.spent).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  selectedCategory.spent <= selectedCategory.budget 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((selectedCategory.spent / selectedCategory.budget) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h4 className="font-bold text-gray-800 mb-4">Category Breakdown</h4>
          <div className="space-y-3">
            {chartData.categories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100;
              const isOverBudget = category.spent > category.budget;
              
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div>
                      <span className="font-medium text-gray-800">{category.name}</span>
                      <div className="text-sm text-gray-500">
                        ₹{category.spent.toLocaleString()} of ₹{category.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${
                      isOverBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isOverBudget ? '+' : ''}{Math.abs(category.budget - category.spent).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Budget Summary Component
export const BudgetSummary = ({ data }) => {
  const chartData = data || {
    total: 50000,
    spent: 32000,
    remaining: 18000,
    categories: []
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Budget Summary</h3>
        <FiFilter className="text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Total Budget</span>
            <span className="font-semibold">₹{chartData.total.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-gt-primary rounded-full"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Amount Spent</span>
            <span className="font-semibold">₹{chartData.spent.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-gt-secondary rounded-full"
              style={{ width: `${(chartData.spent / chartData.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="font-semibold text-green-600">₹{chartData.remaining.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${(chartData.remaining / chartData.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Daily Average</span>
          <span className="font-bold text-gt-primary">
            ₹{Math.round(chartData.spent / 7).toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Based on 7-day trip</div>
      </div>
    </div>
  );
};

export default BudgetChart;