import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProfilePage() {
  // Redirect Profile page to Settings page
  return <Navigate to="/settings" replace />;
}



