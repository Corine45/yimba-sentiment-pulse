
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './App.css';
import Recherche2 from "@/pages/Recherche2";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/auth" element={<div>Auth Page</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardWrapper />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/recherche2" 
              element={
                <ProtectedRoute>
                  <Recherche2 />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function DashboardWrapper() {
  const { user, signOut } = useAuth();
  
  if (!user) return null;
  
  return <Dashboard user={user} onLogout={signOut} />;
}

export default App;
