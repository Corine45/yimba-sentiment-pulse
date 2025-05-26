import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, BarChart, Eye } from "lucide-react";
import { DemographicAnalysis } from "./widgets/DemographicAnalysis";
import { WordCloud } from "./widgets/WordCloud";
import { AIAnalysis } from "./widgets/AIAnalysis";
import { KeywordFrequency } from "./widgets/KeywordFrequency";

interface ReportsPanelProps {
  userRole: string;
  permissions: {
    canGenerateReports: boolean;
    canExportData: boolean;
  };
}

export const ReportsPanel = ({ userRole, permissions }: ReportsPanelProps) => {
  const reports = [
    {
      id: 1,
      title: "Rapport Sentiment Hebdomadaire",
      description: "Analyse des sentiments pour la semaine du 20-26 Mai 2024",
      date: "26 Mai 2024",
      type: "sentiment",
      status: "generated"
    },
    {
      id: 2,
      title: "Analyse de Crise - Secteur Éducation",
      description: "Rapport détaillé sur les mentions négatives dans l'éducation",
      date: "25 Mai 2024",
      type: "crisis",
      status: "generated"
    },
    {
      id: 3,
      title: "Tendances Mensuelles - Mai 2024",
      description: "Vue d'ensemble des tendances et sujets émergents",
      date: "24 Mai 2024",
      type: "trends",
      status: "generating"
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === "generated") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Généré</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En cours...</span>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sentiment":
        return <BarChart className="w-4 h-4 text-blue-600" />;
      case "crisis":
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {userRole === "observateur" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Eye className="w-4 h-4 inline mr-1" />
            Mode consultation - Vous consultez les rapports en lecture seule
          </p>
        </div>
      )}

      {/* Generate New Report */}
      {permissions.canGenerateReports && (
        <Card>
          <CardHeader>
            <CardTitle>Générer un nouveau rapport</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de rapport</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sentiment">Analyse de sentiment</SelectItem>
                    <SelectItem value="demographic">Analyse démographique</SelectItem>
                    <SelectItem value="ai">Analyse IA</SelectItem>
                    <SelectItem value="crisis">Rapport de crise</SelectItem>
                    <SelectItem value="trends">Tendances</SelectItem>
                    <SelectItem value="keywords">Fréquence mots-clés</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="3m">3 derniers mois</SelectItem>
                    <SelectItem value="custom">Période personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <FileText className="w-4 h-4 mr-2" />
              Générer le rapport
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Widget Previews */}
      <Card>
        <CardHeader>
          <CardTitle>
            {permissions.canGenerateReports ? "Aperçu des widgets de rapport" : "Widgets disponibles"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demographic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="demographic">Démographie</TabsTrigger>
              <TabsTrigger value="wordcloud">Nuage de mots</TabsTrigger>
              <TabsTrigger value="ai">Analyse IA</TabsTrigger>
              <TabsTrigger value="frequency">Fréquence</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demographic" className="mt-6">
              <DemographicAnalysis />
            </TabsContent>
            
            <TabsContent value="wordcloud" className="mt-6">
              <WordCloud />
            </TabsContent>
            
            <TabsContent value="ai" className="mt-6">
              <AIAnalysis />
            </TabsContent>
            
            <TabsContent value="frequency" className="mt-6">
              <KeywordFrequency />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>
            {permissions.canGenerateReports ? "Rapports récents" : "Rapports disponibles"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getTypeIcon(report.type)}
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{report.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  {report.status === "generated" && permissions.canExportData && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                  {report.status === "generated" && !permissions.canExportData && (
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Consulter
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      {permissions.canGenerateReports && (
        <Card>
          <CardHeader>
            <CardTitle>Modèles de rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Rapport Exécutif", description: "Vue d'ensemble pour la direction" },
                { name: "Analyse Démographique", description: "Focus sur les données démographiques" },
                { name: "Analyse IA Complète", description: "Rapport avec tous les widgets IA" },
                { name: "Rapport de Crise", description: "Focus sur les alertes et situations critiques" },
                { name: "Tendances & Mots-clés", description: "Analyse des tendances et fréquences" },
                { name: "Rapport Multimédia", description: "Analyse des contenus visuels et vidéos" }
              ].map((template, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Utiliser ce modèle
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
