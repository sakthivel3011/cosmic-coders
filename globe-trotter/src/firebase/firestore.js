import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';
import { authUtils } from './auth';
import toast from 'react-hot-toast';

// Helper function to get current user ID
const getUserId = () => {
  const userId = authUtils.getUserId();
  if (!userId) throw new Error('User must be authenticated');
  return userId;
};

// Trips Collection Operations
export const tripsCollection = {
  // Create a new trip
  create: async (tripData) => {
    try {
      const userId = getUserId();
      
      const trip = {
        ...tripData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'planning',
        shared: false,
        likes: 0,
        views: 0
      };

      const docRef = await addDoc(collection(db, 'trips'), trip);
      
      // Create a default budget document
      await budgetsCollection.create(docRef.id, {
        total: tripData.budget || 0,
        categories: {
          accommodation: 0,
          transportation: 0,
          food: 0,
          activities: 0,
          shopping: 0,
          misc: 0
        }
      });

      toast.success('Trip created successfully!');
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Create trip error:', error);
      toast.error('Failed to create trip');
      return { success: false, error: error.message };
    }
  },

  // Get trip by ID
  getById: async (tripId) => {
    try {
      const docRef = doc(db, 'trips', tripId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Trip not found' };
      }
    } catch (error) {
      console.error('Get trip error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all trips for current user
  getAll: async (options = {}) => {
    try {
      const userId = getUserId();
      let q = query(
        collection(db, 'trips'),
        where('userId', '==', userId)
      );

      // Apply sorting
      if (options.sortBy) {
        q = query(q, orderBy(options.sortBy, options.sortOrder || 'desc'));
      }

      // Apply filters
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      // Apply limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: trips };
    } catch (error) {
      console.error('Get all trips error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update trip
  update: async (tripId, updates) => {
    try {
      const userId = getUserId();
      const tripRef = doc(db, 'trips', tripId);
      
      // Verify ownership
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists() || tripSnap.data().userId !== userId) {
        throw new Error('Unauthorized');
      }

      await updateDoc(tripRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      toast.success('Trip updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update trip error:', error);
      toast.error('Failed to update trip');
      return { success: false, error: error.message };
    }
  },

  // Delete trip
  delete: async (tripId) => {
    try {
      const userId = getUserId();
      const tripRef = doc(db, 'trips', tripId);
      
      // Verify ownership
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists() || tripSnap.data().userId !== userId) {
        throw new Error('Unauthorized');
      }

      // Delete related data in batch
      const batch = writeBatch(db);
      
      // Delete trip
      batch.delete(tripRef);
      
      // Delete budget
      const budgetRef = doc(db, 'budgets', tripId);
      batch.delete(budgetRef);
      
      // Delete activities
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('tripId', '==', tripId)
      );
      const activitiesSnap = await getDocs(activitiesQuery);
      activitiesSnap.forEach((activityDoc) => {
        batch.delete(activityDoc.ref);
      });

      await batch.commit();
      toast.success('Trip deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Delete trip error:', error);
      toast.error('Failed to delete trip');
      return { success: false, error: error.message };
    }
  },

  // Share trip
  share: async (tripId) => {
    try {
      const userId = getUserId();
      const tripRef = doc(db, 'trips', tripId);
      
      // Verify ownership
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists() || tripSnap.data().userId !== userId) {
        throw new Error('Unauthorized');
      }

      await updateDoc(tripRef, {
        shared: true,
        shareToken: Math.random().toString(36).substr(2, 9),
        updatedAt: serverTimestamp()
      });

      toast.success('Trip shared successfully!');
      return { success: true };
    } catch (error) {
      console.error('Share trip error:', error);
      toast.error('Failed to share trip');
      return { success: false, error: error.message };
    }
  },

  // Get shared trip by token
  getShared: async (shareToken) => {
    try {
      const q = query(
        collection(db, 'trips'),
        where('shareToken', '==', shareToken),
        where('shared', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'Shared trip not found' };
      }
    } catch (error) {
      console.error('Get shared trip error:', error);
      return { success: false, error: error.message };
    }
  },

  // Like trip
  like: async (tripId) => {
    try {
      const tripRef = doc(db, 'trips', tripId);
      
      await updateDoc(tripRef, {
        likes: increment(1)
      });

      return { success: true };
    } catch (error) {
      console.error('Like trip error:', error);
      return { success: false, error: error.message };
    }
  },

  // View trip
  view: async (tripId) => {
    try {
      const tripRef = doc(db, 'trips', tripId);
      
      await updateDoc(tripRef, {
        views: increment(1)
      });

      return { success: true };
    } catch (error) {
      console.error('View trip error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Activities Collection Operations
export const activitiesCollection = {
  // Create activity
  create: async (tripId, cityId, activityData) => {
    try {
      const userId = getUserId();
      
      const activity = {
        ...activityData,
        tripId,
        cityId,
        userId,
        createdAt: serverTimestamp(),
        isFavorite: false,
        completed: false
      };

      const docRef = await addDoc(collection(db, 'activities'), activity);

      // Update trip's activities count
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        'stats.totalActivities': increment(1),
        updatedAt: serverTimestamp()
      });

      toast.success('Activity added successfully!');
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Create activity error:', error);
      toast.error('Failed to add activity');
      return { success: false, error: error.message };
    }
  },

  // Get activities for a trip
  getByTrip: async (tripId, options = {}) => {
    try {
      let q = query(
        collection(db, 'activities'),
        where('tripId', '==', tripId)
      );

      if (options.cityId) {
        q = query(q, where('cityId', '==', options.cityId));
      }

      if (options.sortBy) {
        q = query(q, orderBy(options.sortBy, options.sortOrder || 'asc'));
      }

      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: activities };
    } catch (error) {
      console.error('Get activities error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update activity
  update: async (activityId, updates) => {
    try {
      const userId = getUserId();
      const activityRef = doc(db, 'activities', activityId);
      
      // Verify ownership
      const activitySnap = await getDoc(activityRef);
      if (!activitySnap.exists() || activitySnap.data().userId !== userId) {
        throw new Error('Unauthorized');
      }

      await updateDoc(activityRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      toast.success('Activity updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update activity error:', error);
      toast.error('Failed to update activity');
      return { success: false, error: error.message };
    }
  },

  // Delete activity
  delete: async (activityId) => {
    try {
      const userId = getUserId();
      const activityRef = doc(db, 'activities', activityId);
      
      // Verify ownership
      const activitySnap = await getDoc(activityRef);
      if (!activitySnap.exists() || activitySnap.data().userId !== userId) {
        throw new Error('Unauthorized');
      }

      await deleteDoc(activityRef);
      toast.success('Activity deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Delete activity error:', error);
      toast.error('Failed to delete activity');
      return { success: false, error: error.message };
    }
  },

  // Toggle favorite
  toggleFavorite: async (activityId) => {
    try {
      const activityRef = doc(db, 'activities', activityId);
      const activitySnap = await getDoc(activityRef);
      
      if (activitySnap.exists()) {
        const isFavorite = activitySnap.data().isFavorite;
        await updateDoc(activityRef, {
          isFavorite: !isFavorite,
          updatedAt: serverTimestamp()
        });
        
        return { success: true, isFavorite: !isFavorite };
      }
      
      return { success: false, error: 'Activity not found' };
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle completed
  toggleCompleted: async (activityId) => {
    try {
      const activityRef = doc(db, 'activities', activityId);
      const activitySnap = await getDoc(activityRef);
      
      if (activitySnap.exists()) {
        const completed = activitySnap.data().completed;
        await updateDoc(activityRef, {
          completed: !completed,
          updatedAt: serverTimestamp()
        });
        
        return { success: true, completed: !completed };
      }
      
      return { success: false, error: 'Activity not found' };
    } catch (error) {
      console.error('Toggle completed error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Budgets Collection Operations
export const budgetsCollection = {
  // Create budget
  create: async (tripId, budgetData) => {
    try {
      const budgetDoc = {
        ...budgetData,
        tripId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expenses: []
      };

      await setDoc(doc(db, 'budgets', tripId), budgetDoc);
      return { success: true };
    } catch (error) {
      console.error('Create budget error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get budget
  get: async (tripId) => {
    try {
      const docRef = doc(db, 'budgets', tripId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Budget not found' };
      }
    } catch (error) {
      console.error('Get budget error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update budget
  update: async (tripId, updates) => {
    try {
      const budgetRef = doc(db, 'budgets', tripId);
      await updateDoc(budgetRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      toast.success('Budget updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update budget error:', error);
      toast.error('Failed to update budget');
      return { success: false, error: error.message };
    }
  },

  // Add expense
  addExpense: async (tripId, expenseData) => {
    try {
      const budgetRef = doc(db, 'budgets', tripId);
      
      await updateDoc(budgetRef, {
        expenses: arrayUnion({
          ...expenseData,
          id: Math.random().toString(36).substr(2, 9),
          date: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });

      toast.success('Expense added successfully!');
      return { success: true };
    } catch (error) {
      console.error('Add expense error:', error);
      toast.error('Failed to add expense');
      return { success: false, error: error.message };
    }
  },

  // Update expense
  updateExpense: async (tripId, expenseId, updates) => {
    try {
      const budgetRef = doc(db, 'budgets', tripId);
      const budgetSnap = await getDoc(budgetRef);
      
      if (budgetSnap.exists()) {
        const budget = budgetSnap.data();
        const expenses = budget.expenses || [];
        const expenseIndex = expenses.findIndex(exp => exp.id === expenseId);
        
        if (expenseIndex !== -1) {
          expenses[expenseIndex] = { ...expenses[expenseIndex], ...updates };
          
          await updateDoc(budgetRef, {
            expenses,
            updatedAt: serverTimestamp()
          });

          toast.success('Expense updated successfully!');
          return { success: true };
        }
      }
      
      return { success: false, error: 'Expense not found' };
    } catch (error) {
      console.error('Update expense error:', error);
      toast.error('Failed to update expense');
      return { success: false, error: error.message };
    }
  },

  // Delete expense
  deleteExpense: async (tripId, expenseId) => {
    try {
      const budgetRef = doc(db, 'budgets', tripId);
      const budgetSnap = await getDoc(budgetRef);
      
      if (budgetSnap.exists()) {
        const budget = budgetSnap.data();
        const expenses = budget.expenses || [];
        const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
        
        await updateDoc(budgetRef, {
          expenses: updatedExpenses,
          updatedAt: serverTimestamp()
        });

        toast.success('Expense deleted successfully!');
        return { success: true };
      }
      
      return { success: false, error: 'Budget not found' };
    } catch (error) {
      console.error('Delete expense error:', error);
      toast.error('Failed to delete expense');
      return { success: false, error: error.message };
    }
  },

  // Calculate budget summary
  calculateSummary: async (tripId) => {
    try {
      const budgetResult = await budgetsCollection.get(tripId);
      const activitiesResult = await activitiesCollection.getByTrip(tripId);
      
      if (!budgetResult.success || !activitiesResult.success) {
        return { success: false, error: 'Failed to fetch data' };
      }

      const budget = budgetResult.data;
      const activities = activitiesResult.data;

      // Calculate totals
      let totalSpent = 0;
      const categoryTotals = {};

      activities.forEach(activity => {
        const cost = activity.cost || 0;
        totalSpent += cost;
        
        const category = activity.category || 'misc';
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += cost;
      });

      // Calculate remaining by category
      const categories = Object.keys(budget.categories || {}).map(catName => {
        const budgetAmount = budget.categories[catName] || 0;
        const spentAmount = categoryTotals[catName] || 0;
        
        return {
          name: catName,
          budget: budgetAmount,
          spent: spentAmount,
          remaining: budgetAmount - spentAmount,
          percentage: budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
        };
      });

      const summary = {
        totalBudget: budget.total || 0,
        totalSpent,
        totalRemaining: (budget.total || 0) - totalSpent,
        categories,
        dailyAverage: budget.total > 0 ? totalSpent / 7 : 0 // Assuming 7-day trip
      };

      return { success: true, data: summary };
    } catch (error) {
      console.error('Calculate budget summary error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Users Collection Operations
export const usersCollection = {
  // Get user profile
  get: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  update: async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user stats
  getStats: async (userId) => {
    try {
      // Get user's trips
      const tripsQuery = query(
        collection(db, 'trips'),
        where('userId', '==', userId)
      );
      const tripsSnap = await getDocs(tripsQuery);
      const trips = tripsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const stats = {
        totalTrips: trips.length,
        completedTrips: trips.filter(trip => trip.status === 'completed').length,
        totalBudget: trips.reduce((sum, trip) => sum + (trip.budget || 0), 0),
        totalCities: trips.reduce((sum, trip) => sum + (trip.cities?.length || 0), 0),
        upcomingTrips: trips.filter(trip => 
          trip.status === 'planning' || trip.status === 'ongoing'
        ).length
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Cities Collection (Static Data)
export const citiesCollection = {
  // Get all cities (static data)
  getAll: async () => {
    // This could be replaced with actual Firestore data
    const cities = [
      { id: '1', name: 'Paris', country: 'France', countryCode: 'FR', popular: true },
      { id: '2', name: 'Tokyo', country: 'Japan', countryCode: 'JP', popular: true },
      { id: '3', name: 'New York', country: 'USA', countryCode: 'US', popular: true },
      { id: '4', name: 'London', country: 'UK', countryCode: 'GB', popular: true },
      { id: '5', name: 'Dubai', country: 'UAE', countryCode: 'AE', popular: true },
      { id: '6', name: 'Sydney', country: 'Australia', countryCode: 'AU', popular: true },
      { id: '7', name: 'Singapore', country: 'Singapore', countryCode: 'SG', popular: true },
      { id: '8', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', popular: true },
      { id: '9', name: 'Rome', country: 'Italy', countryCode: 'IT', popular: true },
      { id: '10', name: 'Barcelona', country: 'Spain', countryCode: 'ES', popular: true },
      { id: '11', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', popular: true },
      { id: '12', name: 'Berlin', country: 'Germany', countryCode: 'DE', popular: true },
    ];

    return { success: true, data: cities };
  },

  // Search cities
  search: async (searchTerm) => {
    // This would normally query Firestore
    const allCities = await citiesCollection.getAll();
    
    if (!searchTerm.trim()) {
      return allCities;
    }

    const filtered = allCities.data.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return { success: true, data: filtered };
  },

  // Get city by ID
  getById: async (cityId) => {
    const allCities = await citiesCollection.getAll();
    const city = allCities.data.find(c => c.id === cityId);
    
    if (city) {
      return { success: true, data: city };
    } else {
      return { success: false, error: 'City not found' };
    }
  }
};

// Batch Operations
export const batchOperations = {
  // Create trip with initial data
  createTripWithData: async (tripData, cities = [], activities = []) => {
    const batch = writeBatch(db);
    const userId = getUserId();

    try {
      // Create trip document
      const tripRef = doc(collection(db, 'trips'));
      const trip = {
        ...tripData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'planning',
        citiesCount: cities.length,
        activitiesCount: activities.length
      };
      batch.set(tripRef, trip);

      // Create budget document
      const budgetRef = doc(db, 'budgets', tripRef.id);
      const budget = {
        tripId: tripRef.id,
        total: tripData.budget || 0,
        categories: {
          accommodation: 0,
          transportation: 0,
          food: 0,
          activities: 0,
          shopping: 0,
          misc: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      batch.set(budgetRef, budget);

      // Create activities
      activities.forEach(activity => {
        const activityRef = doc(collection(db, 'activities'));
        batch.set(activityRef, {
          ...activity,
          tripId: tripRef.id,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      toast.success('Trip created with all data!');
      return { success: true, tripId: tripRef.id };
    } catch (error) {
      console.error('Batch create error:', error);
      toast.error('Failed to create trip');
      return { success: false, error: error.message };
    }
  },

  // Delete trip and all related data
  deleteTripCompletely: async (tripId) => {
    const batch = writeBatch(db);
    const userId = getUserId();

    try {
      // Verify ownership
      const tripRef = doc(db, 'trips', tripId);
      const tripSnap = await getDoc(tripRef);
      
      if (!tripSnap.exists() || tripSnap.data().userId !== userId) {
        throw new Error('Unauthorized');
      }

      // Delete trip
      batch.delete(tripRef);

      // Delete budget
      const budgetRef = doc(db, 'budgets', tripId);
      batch.delete(budgetRef);

      // Delete all activities for this trip
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('tripId', '==', tripId)
      );
      const activitiesSnap = await getDocs(activitiesQuery);
      activitiesSnap.forEach(activityDoc => {
        batch.delete(activityDoc.ref);
      });

      await batch.commit();
      toast.success('Trip and all related data deleted!');
      return { success: true };
    } catch (error) {
      console.error('Batch delete error:', error);
      toast.error('Failed to delete trip');
      return { success: false, error: error.message };
    }
  }
};

// Transaction Operations
export const transactionOperations = {
  // Update activity and recalculate budget atomically
  updateActivityWithBudget: async (activityId, updates) => {
    try {
      await runTransaction(db, async (transaction) => {
        const activityRef = doc(db, 'activities', activityId);
        const activitySnap = await transaction.get(activityRef);
        
        if (!activitySnap.exists()) {
          throw new Error('Activity not found');
        }

        const activity = activitySnap.data();
        const tripId = activity.tripId;
        const oldCost = activity.cost || 0;
        const newCost = updates.cost || oldCost;
        const costDifference = newCost - oldCost;

        // Update activity
        transaction.update(activityRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });

        // Update budget if cost changed
        if (costDifference !== 0) {
          const budgetRef = doc(db, 'budgets', tripId);
          const budgetSnap = await transaction.get(budgetRef);
          
          if (budgetSnap.exists()) {
            const category = activity.category || 'misc';
            const currentCategoryTotal = budgetSnap.data().categories?.[category] || 0;
            
            transaction.update(budgetRef, {
              [`categories.${category}`]: currentCategoryTotal + costDifference,
              updatedAt: serverTimestamp()
            });
          }
        }
      });

      toast.success('Activity updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Failed to update activity');
      return { success: false, error: error.message };
    }
  }
};

// Default export
export default {
  tripsCollection,
  activitiesCollection,
  budgetsCollection,
  usersCollection,
  citiesCollection,
  batchOperations,
  transactionOperations
};