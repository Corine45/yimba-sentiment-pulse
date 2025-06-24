
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Eye, TrendingUp, Shield, User, Users, Settings } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Profils de test prédéfinis
  const testProfiles = [
    {
      id: "admin",
      name: "Marie Dupont",
      email: "admin@yimba.com",
      password: "admin123",
      role: "admin",
      icon: Settings,
      color: "bg-red-100 text-red-800",
      description: "Accès complet - Gestion utilisateurs, paramètres, veille sanitaire"
    },
    {
      id: "analyste",
      name: "Jean Martin",
      email: "analyste@yimba.com",
      password: "analyste123",
      role: "analyste",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-800",
      description: "Recherches avancées, rapports, analyses complètes"
    },
    {
      id: "observateur",
      name: "Sophie Laurent",
      email: "observateur@yimba.com",
      password: "observateur123",
      role: "observateur",
      icon: Eye,
      color: "bg-gray-100 text-gray-800",
      description: "Consultation uniquement, recherches simples"
    }
  ];

  const handleQuickLogin = (profile: any) => {
    setUser(profile);
    setIsAuthenticated(true);
  };

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
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/a22a86d5-8372-43c1-b810-1514798e3569.png" 
                  alt="YIMBA Logo" 
                  className="w-10 h-10 object-contain"
                />
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
          <div className="grid lg:grid-cols-2 gap-12 items-start">
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

            {/* Right Column - Login and Test Profiles */}
            <div className="lg:pl-8 space-y-6">
              {/* Login Form */}
              <LoginForm 
                onLogin={(userData) => {
                  setUser(userData);
                  setIsAuthenticated(true);
                }} 
              />

              {/* Test Profiles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Profils de test
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Cliquez sur un profil pour vous connecter directement
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {testProfiles.map((profile) => {
                    const IconComponent = profile.icon;
                    return (
                      <div key={profile.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${profile.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{profile.name}</h4>
                              <p className="text-sm text-gray-600">{profile.role}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleQuickLogin(profile)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <User className="w-4 h-4 mr-1" />
                            Tester
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{profile.description}</p>
                        <div className="mt-2 text-xs text-gray-400">
                          <div>📧 {profile.email}</div>
                          <div>🔑 {profile.password}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
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
