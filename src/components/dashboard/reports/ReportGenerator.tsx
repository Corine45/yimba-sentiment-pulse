import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Calendar, BarChart, TrendingUp, Users, Monitor } from "lucide-react";
import { GeneratedReportsList } from "./components/GeneratedReportsList";
import { ReportGenerationProgress } from "./components/ReportGenerationProgress";
import { useReportGenerator } from "./hooks/useReportGenerator";

export const ReportGenerator = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("7d");
  const { toast } = useToast();

  const {
    generatedReports,
    isGenerating,
    progress,
    generateReport,
    downloadReport,
    cancelGeneration
  } = useReportGenerator();

  const handleGenerateReport = async () => {
    if (!reportTitle || !selectedTemplate) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le titre et sélectionner un template",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🔄 GÉNÉRATION RAPPORT CONNECTÉE SUPABASE + API');
      
      await generateReport({
        title: reportTitle,
        description: reportDescription,
        template: selectedTemplate,
        type: 'custom',
        format: selectedFormat as 'pdf' | 'powerpoint' | 'html',
        period: dateRange,
        dateRange,
        // 🔧 CONNEXION: Utiliser les données réelles de Supabase + APIs
        includeRealData: true,
        includeAIContext: true,
        includeDemographics: true,
        includeInfluencers: true,
        includeGeography: true
      });

      // Reset form
      setReportTitle("");
      setReportDescription("");
      setSelectedTemplate("");
      
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le rapport. Vérifiez vos APIs.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = (report: any) => {
    console.log('📥 TÉLÉCHARGEMENT RAPPORT:', report.title);
    downloadReport(report);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <FileText className="w-6 h-6" />
            <span>📋 Générateur de Rapports Avancé</span>
          </CardTitle>
          <p className="text-blue-700 text-sm">
            🔗 Connecté à Supabase et vos 30+ APIs Yimba Pulse pour des rapports enrichis en temps réel
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration du rapport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5" />
              <span>Configuration du rapport</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre du rapport *</Label>
              <Input
                id="title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Ex: Analyse Sentiment Hebdomadaire LGBT+"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Décrivez l'objectif et le contenu de ce rapport..."
                rows={3}
              />
            </div>

            <div>
              <Label>Template de rapport *</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">
                    📊 Rapport Exécutif (Vue d'ensemble)
                  </SelectItem>
                  <SelectItem value="detailed">
                    📈 Rapport Détaillé (Analyse complète)
                  </SelectItem>
                  <SelectItem value="crisis">
                    🚨 Rapport de Crise (Alertes & Actions)
                  </SelectItem>
                  <SelectItem value="influencer">
                    👥 Rapport Influenceurs (Top voices)
                  </SelectItem>
                  <SelectItem value="geographic">
                    🗺️ Rapport Géographique (Répartition)
                  </SelectItem>
                  <SelectItem value="competitive">
                    ⚔️ Rapport Concurrentiel (Benchmarking)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Format de sortie</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="powerpoint">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4" />
                        <span>PowerPoint</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="html">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>HTML Interactif</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Période d'analyse</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Dernières 24h</SelectItem>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="90d">3 derniers mois</SelectItem>
                    <SelectItem value="custom">Période personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fonctionnalités incluses */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✨ Nouvelles fonctionnalités incluses :</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                <div>• 🤖 Analyse IA automatique</div>
                <div>• 👥 Profils d'influenceurs</div>
                <div>• 🗺️ Répartition géographique</div>
                <div>• 📊 Métriques d'engagement</div>
                <div>• 🎯 Analyse démographique</div>
                <div>• 📈 Tendances temporelles</div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating || !reportTitle || !selectedTemplate}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  🚀 Générer le rapport
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Aperçu et statistiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Données sources connectées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">30+</div>
                  <div className="text-sm text-blue-700">APIs connectées</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">🔄</div>
                  <div className="text-sm text-green-700">Temps réel</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">🔗 Sources de données :</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• 📊 Supabase (Historique)</div>
                  <div>• 🎵 TikTok API</div>
                  <div>• 📘 Facebook API</div>
                  <div>• 🐦 Twitter/X API</div>
                  <div>• 📸 Instagram API</div>
                  <div>• 🎥 YouTube API</div>
                  <div>• 🔍 Google Search</div>
                  <div>• 🌐 Web Scraping</div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-medium text-purple-900 mb-1">🤖 IA Contexte Automatique</h4>
                <p className="text-sm text-purple-700">
                  Chaque rapport inclut une analyse IA contextuelle basée sur vos données Supabase 
                  pour des insights automatiques et des recommandations personnalisées.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      {isGenerating && (
        <ReportGenerationProgress 
          progress={progress} 
          onCancel={cancelGeneration}
        />
      )}

      {/* Liste des rapports générés */}
      <GeneratedReportsList 
        reports={generatedReports}
        onDownload={handleDownloadReport}
      />

      {/* Informations sur les rapports programmés */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-900">
            <Calendar className="w-5 h-5" />
            <span>📅 Rapports programmés (Prochainement)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 text-sm">
            La fonctionnalité de rapports programmés sera bientôt disponible. 
            Vous pourrez automatiser la génération de rapports quotidiens, hebdomadaires ou mensuels 
            avec notification par email via Supabase Edge Functions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
