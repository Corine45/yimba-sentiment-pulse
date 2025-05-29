
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { Globe, Eye, TrendingUp, Shield, Users, BarChart3, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
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
            <div className="flex items-center space-x-4">
              <Link to="/about">
                <Button variant="ghost" size="sm">
                  À propos
                </Button>
              </Link>
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
                  Plateforme d'Analyse
                  <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Émotionnelle Digitale
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Développée par le Laboratoire d'Innovation du PNUD Côte d'Ivoire, 
                  YIMBA analyse en temps réel les opinions et émotions exprimées sur 
                  les réseaux sociaux, blogs, forums et sites d'actualité.
                </p>
              </div>

              {/* Mission YIMBA */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">La mission YIMBA :</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700"><strong>Y</strong>eux</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700"><strong>I</strong>ntelligents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700"><strong>M</strong>ultiples sources</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700"><strong>B</strong>ouger les lignes</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:col-span-2 justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700"><strong>A</strong>ccélération</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Analyse en temps réel</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Intelligence collective</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Analyse démographique</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-blue-100">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Rapports personnalisables</span>
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              YIMBA analyse toutes les données publiquement accessibles : commentaires, 
              publications et interactions visibles sur les plateformes en ligne.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Recherche ciblée</h4>
              <p className="text-gray-600">
                Effectuez des recherches précises en saisissant des mots-clés. 
                L'analyse automatique identifie les sentiments et tendances.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-cyan-50 border border-cyan-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-cyan-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Analyse complète</h4>
              <p className="text-gray-600">
                Identification des sentiments (positif, neutre, négatif), hashtags, 
                régions concernées et démographie de l'audience.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Rapports flexibles</h4>
              <p className="text-gray-600">
                Rapports personnalisables transmis en formats HTML, PPT ou PDF 
                selon vos besoins spécifiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Développée en 2023 par le Laboratoire d'Innovation du PNUD Côte d'Ivoire
            </p>
            <p className="text-gray-500">
              Accessible sur <a href="https://www.yimbaci.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.yimbaci.net</a>
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 YIMBA - Plateforme d'analyse émotionnelle digitale
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
