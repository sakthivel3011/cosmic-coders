
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import MyTripsPage from './pages/MyTripsPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import BudgetPage from './pages/BudgetPage';
import ProfilePage from './pages/ProfilePage';
import ShareTripPage from './pages/ShareTripPage';

// Import CSS
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gt-bg-light">
          <Header />
          
          <main className="flex-grow container-responsive section-padding">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/share/:tripId" element={<ShareTripPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create-trip" element={<CreateTripPage />} />
              <Route path="/my-trips" element={<MyTripsPage />} />
              <Route path="/trip/:tripId/build" element={<ItineraryBuilderPage />} />
              <Route path="/trip/:tripId/view" element={<ItineraryViewPage />} />
              <Route path="/trip/:tripId/budget" element={<BudgetPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

