
import { Globe, TrendingUp, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
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

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
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
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-200/30 rounded-full blur-3xl" />
    </div>
  );
};
