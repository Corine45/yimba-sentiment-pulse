
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { Globe, Eye, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
        
        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                YIMBA
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                Français
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Veille Émotionnelle
                  <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Réseaux Sociaux
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Analysez les sentiments, détectez les crises et surveillez votre e-réputation 
                  en temps réel sur tous les réseaux sociaux.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Analyse en temps réel</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Détection de crise</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Veille multiplateforme</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Support multilingue</span>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="lg:pl-8">
              <LoginForm 
                onLogin={(userData) => {
                  setUser(userData);
                  setIsAuthenticated(true);
                }} 
              />
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">
            © 2024 YIMBA - Plateforme de veille émotionnelle pour les réseaux sociaux
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
