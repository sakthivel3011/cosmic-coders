import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

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

// Performance monitoring
const reportWebVitals = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // Send to analytics
  if (analytics) {
    const { name, delta, value, id } = metric;
    analytics.logEvent('web_vitals', {
      name,
      delta: Math.round(delta),
      value: Math.round(value),
      id,
    });
  }
};

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
      analytics.logEvent('error', {
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

// Service Worker Registration
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered: ', registration);
      },
      (error) => {
        console.log('SW registration failed: ', error);
      }
    );
  });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);