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
