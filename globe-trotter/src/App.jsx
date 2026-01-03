import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import MyTripsPage from './pages/MyTripsPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import BudgetPage from './pages/BudgetPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import ShareTripPage from './pages/ShareTripPage';
import Settings from './pages/Settings';

// Import global styles
import './styles/global.css';
import './styles/variables.css';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const { darkMode } = useAuth();
  
  // Hide header/footer on auth pages
  const hideLayout = ['/login', '/signup', '/share'].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {!hideLayout && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {!hideLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/share/:tripId" element={<ShareTripPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Navigate to="/dashboard" replace />
              </PrivateRoute>
            } />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />
            
            <Route path="/create-trip" element={
              <PrivateRoute>
                <CreateTripPage />
              </PrivateRoute>
            } />
            
            <Route path="/my-trips" element={
              <PrivateRoute>
                <MyTripsPage />
              </PrivateRoute>
            } />
            
            <Route path="/trip/:tripId/build" element={
              <PrivateRoute>
                <ItineraryBuilderPage />
              </PrivateRoute>
            } />
            
            <Route path="/trip/:tripId/view" element={
              <PrivateRoute>
                <ItineraryViewPage />
              </PrivateRoute>
            } />
            
            <Route path="/trip/:tripId/budget" element={
              <PrivateRoute>
                <BudgetPage />
              </PrivateRoute>
            } />

            <Route path="/explore" element={
              <PrivateRoute>
                <ExplorePage />
              </PrivateRoute>
            } />

            
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a 
                    href="/dashboard" 
                    className="btn-primary inline-block"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </Layout>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-success)',
                secondary: 'var(--color-white)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--color-error)',
                secondary: 'var(--color-white)',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;