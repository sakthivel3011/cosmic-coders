<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  FiPieChart, FiTrendingUp, FiTrendingDown, 
  FiDollarSign, FiShoppingBag, FiCoffee, 
  FiHome, FiNavigation 
} from 'react-icons/fi';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    total: 0,
    categories: {
      accommodation: 0,
      transportation: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      misc: 0,
    }
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const docRef = doc(db, 'trips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const tripData = { id: docSnap.id, ...docSnap.data() };
          setTrip(tripData);
          
          // Calculate budget data
          let totalActivitiesCost = 0;
          let accommodationCost = 0;
          let transportationCost = 0;
          let foodCost = 0;
          let shoppingCost = 0;
          let miscCost = 0;

          // Calculate from activities
          tripData.cities?.forEach(city => {
            city.activities?.forEach(activity => {
              totalActivitiesCost += activity.cost || 0;
              // Categorize based on activity type (you can add type field to activities)
              miscCost += activity.cost || 0;
            });
          });

          setBudgetData({
            total: tripData.budget || 0,
            categories: {
              accommodation: accommodationCost,
              transportation: transportationCost,
              food: foodCost,
              activities: totalActivitiesCost,
              shopping: shoppingCost,
              misc: miscCost,
            }
          });
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const chartData = {
    labels: ['Accommodation', 'Transportation', 'Food', 'Activities', 'Shopping', 'Misc'],
    datasets: [
      {
        data: [
          budgetData.categories.accommodation,
          budgetData.categories.transportation,
          budgetData.categories.food,
          budgetData.categories.activities,
          budgetData.categories.shopping,
          budgetData.categories.misc,
        ],
        backgroundColor: [
          '#1b5e20',
          '#2e7d32',
          '#43a047',
          '#66bb6a',
          '#81c784',
          '#a5d6a7',
        ],
        borderWidth: 1,
      },
    ],
  };

  const remainingBudget = budgetData.total - Object.values(budgetData.categories).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gt-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="page-padding text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip not found</h2>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="page-padding fade-in">
      <div className="mb-8">
        <h1 className="heading-primary">{trip.name} - Budget</h1>
        <p className="text-gray-600">Track your trip expenses and manage your budget</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Total Budget Card */}
          <div className="card-padded">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Total Budget</h2>
                <p className="text-gray-600">Allocated for this trip</p>
              </div>
              <FiPieChart className="text-3xl text-gt-primary" />
            </div>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gt-primary mb-2">
                ₹{budgetData.total.toLocaleString()}
              </div>
              <p className="text-gray-600">Total allocated amount</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card-padded">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Expense Breakdown</h2>
            <div className="space-y-4">
              {[
                { name: 'Accommodation', value: budgetData.categories.accommodation, icon: FiHome, color: 'bg-gt-primary' },
                { name: 'Transportation', value: budgetData.categories.transportation, icon: FiNavigation, color: 'bg-gt-secondary' },
                { name: 'Food & Drinks', value: budgetData.categories.food, icon: FiCoffee, color: 'bg-gt-accent' },
                { name: 'Activities', value: budgetData.categories.activities, icon: FiShoppingBag, color: 'bg-gt-light' },
                { name: 'Shopping', value: budgetData.categories.shopping, icon: FiShoppingBag, color: 'bg-blue-500' },
                { name: 'Miscellaneous', value: budgetData.categories.misc, icon: FiDollarSign, color: 'bg-gray-500' },
              ].map((category, index) => {
                const percentage = budgetData.total > 0 ? (category.value / budgetData.total) * 100 : 0;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        <category.icon />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">₹{category.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gt-primary"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="card-padded">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Budget Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Budget</span>
                <span className="font-semibold">₹{budgetData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-semibold text-red-600">
                  ₹{Object.values(budgetData.categories).reduce((a, b) => a + b, 0).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Remaining Budget</span>
                  <span className={`font-bold text-xl ${
                    remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{remainingBudget.toLocaleString()}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {remainingBudget >= 0 ? 'Within budget' : 'Over budget'}
                </p>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card-padded">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Expense Distribution</h2>
            <div className="h-64">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Budget Tips */}
          <div className="card-padded bg-gt-bg-section">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Tips</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FiTrendingUp className="text-green-600 mt-1" />
                <span className="text-sm">Book accommodations in advance for better rates</span>
              </li>
              <li className="flex items-start gap-2">
                <FiTrendingDown className="text-red-600 mt-1" />
                <span className="text-sm">Use public transportation to save on travel costs</span>
              </li>
              <li className="flex items-start gap-2">
                <FiDollarSign className="text-blue-600 mt-1" />
                <span className="text-sm">Set daily spending limits for each category</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link to={`/trip/${tripId}/view`} className="btn-secondary flex-1">
              Back to Itinerary
            </Link>
            <Link to={`/trip/${tripId}/build`} className="btn-primary flex-1">
              Edit Expenses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
=======
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GlobeTrotter - Budget Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'gt-primary': '#1b5e20',
                        'gt-secondary': '#2e7d32',
                        'gt-accent': '#43a047',
                        'gt-light': '#81c784',
                        'gt-soft': '#c8e6c9',
                        'gt-bg-light': '#f4fdf6',
                        'gt-bg-section': '#e8f5e9',
                        'gt-bg-dark': '#102a13',
                        'gt-border': '#d0e8d4',
                        'gt-error': '#c62828',
                        'gt-warning': '#f9a825',
                        'gt-success': '#2e7d32'
                    },
                    boxShadow: {
                        'gt-soft': '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gt-bg-light min-h-screen p-4 md:p-6">
    <!-- Main Container -->
    <div class="max-w-7xl mx-auto">
        
        <!-- Header -->
        <header class="bg-white rounded-xl shadow-gt-soft p-4 md:p-6 mb-6 md:mb-8">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <!-- Logo and Title -->
                <div class="flex items-center gap-3">
                    <div class="bg-gt-primary p-3 rounded-lg">
                        <i class="fas fa-globe-americas text-white text-2xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-gt-primary">GlobeTrotter</h1>
                        <p class="text-gray-600 text-sm md:text-base">Trip Budget Analysis Dashboard</p>
                    </div>
                </div>

                <!-- Trip Info -->
                <div class="bg-gt-bg-section p-4 md:p-5 rounded-lg border-l-4 border-gt-accent w-full md:w-auto">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <h2 class="text-lg md:text-xl font-bold text-gray-800">Europe Adventure 2024</h2>
                            <div class="flex flex-wrap gap-3 md:gap-4 mt-2">
                                <span class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-calendar-alt text-gt-accent"></i>
                                    <span class="text-sm">Mar 15 - Mar 30, 2024</span>
                                </span>
                                <span class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-map-marker-alt text-gt-accent"></i>
                                    <span class="text-sm">4 Cities</span>
                                </span>
                                <span class="flex items-center gap-2 text-gray-600">
                                    <i class="fas fa-users text-gt-accent"></i>
                                    <span class="text-sm">2 Travelers</span>
                                </span>
                            </div>
                        </div>
                        <button class="bg-gt-accent text-white px-4 py-2 rounded-lg hover:bg-gt-secondary transition-colors flex items-center gap-2">
                            <i class="fas fa-edit"></i>
                            Edit Trip
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Budget Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <!-- Total Budget Card -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 border-t-4 border-gt-primary hover:transform hover:-translate-y-1 transition-transform">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-gray-600 font-medium">Total Budget</h3>
                    <i class="fas fa-wallet text-gt-primary text-xl"></i>
                </div>
                <p class="text-3xl md:text-4xl font-bold text-gt-primary mb-2">$3,500</p>
                <p class="text-gray-500 text-sm">Planned amount</p>
            </div>

            <!-- Spent Budget Card -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 border-t-4 border-gt-error hover:transform hover:-translate-y-1 transition-transform">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-gray-600 font-medium">Spent</h3>
                    <i class="fas fa-money-bill-wave text-gt-error text-xl"></i>
                </div>
                <p class="text-3xl md:text-4xl font-bold text-gt-error mb-2">$1,845</p>
                <p class="text-gray-500 text-sm">52% of budget</p>
            </div>

            <!-- Remaining Budget Card -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 border-t-4 border-blue-500 hover:transform hover:-translate-y-1 transition-transform">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-gray-600 font-medium">Remaining</h3>
                    <i class="fas fa-piggy-bank text-blue-500 text-xl"></i>
                </div>
                <p class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">$1,655</p>
                <p class="text-gray-500 text-sm">Available to spend</p>
            </div>

            <!-- Daily Average Card -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 border-t-4 border-gt-warning hover:transform hover:-translate-y-1 transition-transform">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-gray-600 font-medium">Daily Average</h3>
                    <i class="fas fa-chart-line text-gt-warning text-xl"></i>
                </div>
                <p class="text-3xl md:text-4xl font-bold text-gt-warning mb-2">$123</p>
                <p class="text-gray-500 text-sm">Per day per person</p>
            </div>
        </div>

        <!-- Charts and Breakdown Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <!-- Expense Distribution Chart -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 md:p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fas fa-chart-pie text-gt-accent"></i>
                        Expense Distribution
                    </h3>
                    <select class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option>By Category</option>
                        <option>By Day</option>
                        <option>By City</option>
                    </select>
                </div>
                <div class="h-64 md:h-72">
                    <canvas id="expenseChart"></canvas>
                </div>
            </div>

            <!-- Budget Progress -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 md:p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fas fa-chart-bar text-gt-accent"></i>
                        Budget Progress
                    </h3>
                    <span class="text-sm text-gray-500">15 days total</span>
                </div>
                
                <!-- Budget Progress Bars -->
                <div class="space-y-5">
                    <!-- Accommodation -->
                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-gray-700 font-medium">Accommodation</span>
                            <span class="text-gray-600">$850 / $1,000</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-gt-primary h-2.5 rounded-full" style="width: 85%"></div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Spent: $850</span>
                            <span>Remaining: $150</span>
                        </div>
                    </div>

                    <!-- Transportation -->
                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-gray-700 font-medium">Transportation</span>
                            <span class="text-gray-600">$420 / $600</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-500 h-2.5 rounded-full" style="width: 70%"></div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Spent: $420</span>
                            <span>Remaining: $180</span>
                        </div>
                    </div>

                    <!-- Activities -->
                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-gray-700 font-medium">Activities</span>
                            <span class="text-gray-600">$300 / $800</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-purple-500 h-2.5 rounded-full" style="width: 37.5%"></div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Spent: $300</span>
                            <span>Remaining: $500</span>
                        </div>
                    </div>

                    <!-- Food & Dining -->
                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-gray-700 font-medium">Food & Dining</span>
                            <span class="text-gray-600">$275 / $700</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-gt-warning h-2.5 rounded-full" style="width: 39%"></div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Spent: $275</span>
                            <span>Remaining: $425</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detailed Breakdown -->
        <div class="bg-white rounded-xl shadow-gt-soft p-5 md:p-6 mb-6 md:mb-8">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <i class="fas fa-list-alt text-gt-accent"></i>
                    Detailed Expense Breakdown
                </h3>
                <button class="bg-gt-accent text-white px-4 py-2 rounded-lg hover:bg-gt-secondary transition-colors flex items-center gap-2">
                    <i class="fas fa-download"></i>
                    Export CSV
                </button>
            </div>

            <!-- Table for larger screens -->
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gt-bg-section">
                            <th class="text-left p-3 text-gray-700 font-semibold">Category</th>
                            <th class="text-left p-3 text-gray-700 font-semibold">Planned</th>
                            <th class="text-left p-3 text-gray-700 font-semibold">Spent</th>
                            <th class="text-left p-3 text-gray-700 font-semibold">Remaining</th>
                            <th class="text-left p-3 text-gray-700 font-semibold">Status</th>
                            <th class="text-left p-3 text-gray-700 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="p-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-gt-soft flex items-center justify-center">
                                        <i class="fas fa-bed text-gt-primary"></i>
                                    </div>
                                    <span>Accommodation</span>
                                </div>
                            </td>
                            <td class="p-3 font-medium">$1,000</td>
                            <td class="p-3 font-medium">$850</td>
                            <td class="p-3 font-medium text-blue-600">$150</td>
                            <td class="p-3">
                                <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                    On Track
                                </span>
                            </td>
                            <td class="p-3">
                                <button class="text-gt-accent hover:text-gt-secondary">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="p-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <i class="fas fa-train text-blue-500"></i>
                                    </div>
                                    <span>Transportation</span>
                                </div>
                            </td>
                            <td class="p-3 font-medium">$600</td>
                            <td class="p-3 font-medium">$420</td>
                            <td class="p-3 font-medium text-blue-600">$180</td>
                            <td class="p-3">
                                <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                    On Track
                                </span>
                            </td>
                            <td class="p-3">
                                <button class="text-gt-accent hover:text-gt-secondary">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="p-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                        <i class="fas fa-hiking text-purple-500"></i>
                                    </div>
                                    <span>Activities</span>
                                </div>
                            </td>
                            <td class="p-3 font-medium">$800</td>
                            <td class="p-3 font-medium">$300</td>
                            <td class="p-3 font-medium text-blue-600">$500</td>
                            <td class="p-3">
                                <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                    Good Progress
                                </span>
                            </td>
                            <td class="p-3">
                                <button class="text-gt-accent hover:text-gt-secondary">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="p-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                                        <i class="fas fa-utensils text-yellow-500"></i>
                                    </div>
                                    <span>Food & Dining</span>
                                </div>
                            </td>
                            <td class="p-3 font-medium">$700</td>
                            <td class="p-3 font-medium">$275</td>
                            <td class="p-3 font-medium text-blue-600">$425</td>
                            <td class="p-3">
                                <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                    Good Progress
                                </span>
                            </td>
                            <td class="p-3">
                                <button class="text-gt-accent hover:text-gt-secondary">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile View -->
            <div class="md:hidden space-y-4">
                <!-- Mobile Card 1 -->
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-gt-soft flex items-center justify-center">
                                <i class="fas fa-bed text-gt-primary"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold">Accommodation</h4>
                                <p class="text-sm text-gray-500">Hotels & Stays</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            On Track
                        </span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p class="text-sm text-gray-500">Planned</p>
                            <p class="font-bold">$1,000</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Spent</p>
                            <p class="font-bold">$850</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Remaining</p>
                            <p class="font-bold text-blue-600">$150</p>
                        </div>
                    </div>
                </div>

                <!-- Mobile Card 2 -->
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <i class="fas fa-train text-blue-500"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold">Transportation</h4>
                                <p class="text-sm text-gray-500">Flights, Trains, Taxis</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            On Track
                        </span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p class="text-sm text-gray-500">Planned</p>
                            <p class="font-bold">$600</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Spent</p>
                            <p class="font-bold">$420</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Remaining</p>
                            <p class="font-bold text-blue-600">$180</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Daily Spending & Notes -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <!-- Daily Spending -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 md:p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i class="fas fa-calendar-day text-gt-accent"></i>
                    Daily Spending Trend
                </h3>
                <div class="h-64">
                    <canvas id="dailyChart"></canvas>
                </div>
            </div>

            <!-- Budget Notes & Alerts -->
            <div class="bg-white rounded-xl shadow-gt-soft p-5 md:p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i class="fas fa-bell text-gt-accent"></i>
                    Budget Alerts & Notes
                </h3>
                
                <div class="space-y-4">
                    <!-- Alert 1 -->
                    <div class="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
                        <i class="fas fa-exclamation-triangle text-yellow-500 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-gray-800">Budget Alert</h4>
                            <p class="text-sm text-gray-600">Accommodation spending is approaching limit (85% used)</p>
                        </div>
                    </div>

                    <!-- Alert 2 -->
                    <div class="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-r">
                        <i class="fas fa-check-circle text-green-500 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-gray-800">Good Progress</h4>
                            <p class="text-sm text-gray-600">Transportation budget is well managed with 30% remaining</p>
                        </div>
                    </div>

                    <!-- Note -->
                    <div class="border border-gray-200 rounded-lg p-4 mt-4">
                        <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <i class="fas fa-sticky-note text-gt-accent"></i>
                            Budget Notes
                        </h4>
                        <p class="text-gray-600 text-sm mb-3">Remember to allocate $200 for souvenirs and gifts. Consider reducing dining budget if activities exceed planned amount.</p>
                        <textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gt-accent" rows="3" placeholder="Add budget note..."></textarea>
                        <button class="mt-2 bg-gt-accent text-white px-4 py-2 rounded-lg hover:bg-gt-secondary transition-colors text-sm">
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-gray-600 text-sm">
                <p>Last updated: Today, 2:45 PM</p>
            </div>
            <div class="flex gap-3">
                <button class="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <i class="fas fa-print"></i>
                    Print
                </button>
                <button class="px-5 py-2.5 bg-gt-primary text-white rounded-lg hover:bg-gt-secondary transition-colors flex items-center gap-2">
                    <i class="fas fa-share-alt"></i>
                    Share Budget
                </button>
                <button class="px-5 py-2.5 bg-gt-accent text-white rounded-lg hover:bg-gt-secondary transition-colors flex items-center gap-2">
                    <i class="fas fa-sync-alt"></i>
                    Update Budget
                </button>
            </div>
        </div>

    </div>

    <!-- Chart.js Scripts -->
    <script>
        // Initialize Expense Distribution Chart
        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        const expenseChart = new Chart(expenseCtx, {
            type: 'doughnut',
            data: {
                labels: ['Accommodation', 'Transportation', 'Activities', 'Food & Dining', 'Miscellaneous'],
                datasets: [{
                    data: [850, 420, 300, 275, 100],
                    backgroundColor: [
                        '#1b5e20', // gt-primary
                        '#2196f3', // blue
                        '#9c27b0', // purple
                        '#ff9800', // yellow/orange
                        '#795548'  // brown
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '$' + context.raw;
                                return label;
                            }
                        }
                    }
                }
            }
        });

        // Initialize Daily Spending Chart
        const dailyCtx = document.getElementById('dailyChart').getContext('2d');
        const dailyChart = new Chart(dailyCtx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                    label: 'Daily Spending',
                    data: [120, 135, 110, 150, 180, 130, 125],
                    borderColor: '#43a047', // gt-accent
                    backgroundColor: 'rgba(67, 160, 71, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Spent: $' + context.raw;
                            }
                        }
                    }
                }
            }
        });

        // Mobile menu toggle (if needed)
        document.addEventListener('DOMContentLoaded', function() {
            console.log('GlobeTrotter Budget Dashboard loaded successfully!');
        });
    </script>
</body>
</html>
>>>>>>> c1a9105c7c79c741a573b066052f95f621c86c25
