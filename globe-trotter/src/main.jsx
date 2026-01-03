import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFkqnC0vYYzbkViZp-it1iEa-cQTVXX9E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gobletrip.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gobletrip",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gobletrip.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1035202396192",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1035202396192:web:def68f3cf62a5c243d3c45",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4VC2F07NTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

// Export for use in other files
export { app, analytics };

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    if (analytics) {
      logEvent(analytics, 'error', {
        error: error.toString(),
        errorInfo: JSON.stringify(errorInfo),
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);