import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Dashboard } from './components/dashboard/Dashboard';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Recherche2 from "@/pages/Recherche2";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthProvider>
                  <Dashboard />
                </AuthProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/recherche2" element={<Recherche2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
