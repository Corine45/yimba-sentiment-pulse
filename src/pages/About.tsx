
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ArrowLeft, Users, Target, Lightbulb, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
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
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À propos de 
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              YIMBA
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            YIMBA est une plateforme digitale d'analyse émotionnelle développée en 2023 
            par le Laboratoire d'Innovation du PNUD Côte d'Ivoire, en partenariat avec 
            des start-ups locales.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span>Notre Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                Créée comme un outil de « sense making » et d'intelligence collective, 
                YIMBA capte et analyse en temps réel les opinions et émotions exprimées 
                sur les réseaux sociaux, blogs, forums et sites d'actualité.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Toutes les données analysées par YIMBA sont publiquement accessibles : 
                commentaires, publications et interactions visibles par tous sur les 
                plateformes en ligne.
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyan-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-6 h-6 text-cyan-600" />
                <span>Innovation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                Développée en partenariat avec des start-ups locales, YIMBA représente 
                une innovation majeure dans le domaine de l'analyse des sentiments et 
                de l'intelligence collective.
              </p>
              <p className="text-gray-600 leading-relaxed">
                La plateforme utilise des technologies avancées pour transformer 
                les données publiques en insights exploitables et rapports personnalisés.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* YIMBA Meaning */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              La signification de YIMBA
            </CardTitle>
            <CardDescription className="text-lg">
              Chaque lettre porte un sens profond qui définit notre approche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">Y</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Yeux</h3>
                <p className="text-sm text-gray-600">
                  Observer et surveiller en permanence
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">I</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Intelligents</h3>
                <p className="text-sm text-gray-600">
                  Analyse intelligente et automatisée
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">M</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multiples sources</h3>
                <p className="text-sm text-gray-600">
                  Données provenant de diverses plateformes
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">B</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bouger les lignes</h3>
                <p className="text-sm text-gray-600">
                  Transformer les insights en actions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">A</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Accélération</h3>
                <p className="text-sm text-gray-600">
                  Accélérer la prise de décision
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Fonctionnalités clés
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recherche intelligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les utilisateurs peuvent effectuer des recherches ciblées en saisissant 
                  des mots-clés sur la plateforme. L'application analyse alors automatiquement 
                  les résultats associés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identification précise des sentiments (positif, neutre, négatif), 
                  des tendances émergentes, des hashtags populaires et des régions concernées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse démographique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compréhension approfondie de la démographie de l'audience pour 
                  des insights plus précis et des stratégies mieux ciblées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rapports personnalisables</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Génération de rapports sur mesure transmis en formats HTML, PPT ou PDF, 
                  adaptés aux besoins spécifiques de chaque utilisateur.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="text-center bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>Nous contacter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Pour plus d'informations sur YIMBA ou pour démarrer votre analyse, 
              visitez notre plateforme en ligne.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="https://www.yimbaci.net" target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Visiter www.yimbaci.net
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">
            © 2024 YIMBA - Laboratoire d'Innovation du PNUD Côte d'Ivoire
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
