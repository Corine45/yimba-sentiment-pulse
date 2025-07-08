
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import Home from "./pages/Home";
import About from "./pages/About";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AnalystWorkspace from "./pages/AnalystWorkspace";
import Profile from "./pages/Profile";
import StatusOverview from "./pages/StatusOverview";
import NotFound from "./pages/NotFound";

// Ajout du composant racine pour gérer les routes
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

// Composant wrapper pour le tracking de session
const AppWithSessionTracking = () => {
  useSessionTracking(); // Activer le tracking pour tous les utilisateurs connectés
  
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Redirection automatique de /login vers /dashboard */}
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            
            {/* Routes protégées */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/status" 
              element={
                <ProtectedRoute>
                  <StatusOverview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analyst" 
              element={
                <ProtectedRoute requiredRole="analyste">
                  <AnalystWorkspace />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppWithSessionTracking />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
