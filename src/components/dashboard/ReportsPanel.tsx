
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  type: 'summary' | 'detailed' | 'comparison' | 'trend';
  period: string;
  platforms: string[];
  keywords: string[];
  created_at: string;
  status: 'generating' | 'ready' | 'error';
  file_url?: string;
}

interface ReportData {
  total_mentions: number;
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  platform_breakdown: { [key: string]: number };
  top_keywords: { keyword: string; count: number }[];
  engagement_stats: {
    total_likes: number;
    total_comments: number;
    total_shares: number;
  };
}

export const ReportsPanel = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [reportTitle, setReportTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
    loadReportData();
  }, []);

  const loadReports = async () => {
    try {
      // Simuler des rapports connectés à Supabase
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Rapport mensuel - Janvier 2025',
          type: 'summary',
          period: '30d',
          platforms: ['TikTok', 'Facebook', 'Instagram'],
          keywords: ['abidjan', 'civbuzz', 'côte d\'ivoire'],
          created_at: new Date().toISOString(),
          status: 'ready',
          file_url: '/reports/monthly-jan-2025.pdf'
        },
        {
          id: '2',
          title: 'Analyse sentiment - Semaine 1',
          type: 'detailed',
          period: '7d',
          platforms: ['Twitter', 'Facebook'],
          keywords: ['politique', 'élections'],
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'ready',
          file_url: '/reports/sentiment-week1.pdf'
        },
        {
          id: '3',
          title: 'Tendances en cours',
          type: 'trend',
          period: '24h',
          platforms: ['TikTok', 'Instagram'],
          keywords: ['actualité', 'news'],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'generating'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
    }
  };

  const loadReportData = async () => {
    try {
      // Simuler des données de rapport connectées aux APIs
      const mockData: ReportData = {
        total_mentions: 1247,
        sentiment_breakdown: {
          positive: 524,
          neutral: 498,
          negative: 225
        },
        platform_breakdown: {
          'TikTok': 387,
          'Facebook': 298,
          'Instagram': 234,
          'Twitter': 189,
          'YouTube': 98,
          'Google': 41
        },
        top_keywords: [
          { keyword: 'abidjan', count: 156 },
          { keyword: 'civbuzz', count: 134 },
          { keyword: 'côte d\'ivoire', count: 89 },
          { keyword: 'actualité', count: 67 },
          { keyword: 'news', count: 43 }
        ],
        engagement_stats: {
          total_likes: 15847,
          total_comments: 3289,
          total_shares: 1456
        }
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const generateReport = async () => {
    if (!reportTitle) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre pour le rapport",
        variant: "destructive",
      });
      return;
    }

    try {
      const newReport: Report = {
        id: Date.now().toString(),
        title: reportTitle,
        type: 'summary',
        period: selectedPeriod,
        platforms: selectedPlatforms,
        keywords: [], // Récupérer depuis les recherches actives
        created_at: new Date().toISOString(),
        status: 'generating'
      };

      setReports([newReport, ...reports]);
      setReportTitle('');

      // Simuler la génération du rapport
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'ready', file_url: `/reports/${newReport.id}.pdf` }
            : report
        ));
        
        toast({
          title: "Rapport généré",
          description: `Le rapport "${newReport.title}" a été généré avec succès`,
        });
      }, 3000);

      toast({
        title: "Génération en cours",
        description: "Votre rapport est en cours de génération...",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport",
        variant: "destructive",
      });
    }
  };

  const downloadReport = (report: Report) => {
    // Simuler le téléchargement
    toast({
      title: "Téléchargement",
      description: `Téléchargement de "${report.title}" en cours...`,
    });
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
    toast({
      title: "Rapport supprimé",
      description: "Le rapport a été supprimé avec succès",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return '✅';
      case 'generating': return '🔄';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'summary': return '📋';
      case 'detailed': return '📊';
      case 'comparison': return '📈';
      case 'trend': return '📉';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tableau de bord des statistiques */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total mentions</p>
                  <p className="text-2xl font-bold text-blue-600">{reportData.total_mentions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Sentiment positif</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((reportData.sentiment_breakdown.positive / reportData.total_mentions) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Engagement total</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(reportData.engagement_stats.total_likes + 
                      reportData.engagement_stats.total_comments + 
                      reportData.engagement_stats.total_shares).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Rapports générés</p>
                  <p className="text-2xl font-bold text-purple-600">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">➕ Générer un rapport</TabsTrigger>
          <TabsTrigger value="history">📚 Historique</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Générer un nouveau rapport</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre du rapport</label>
                  <Input
                    placeholder="ex: Rapport mensuel janvier 2025..."
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Période</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Dernières 24h</SelectItem>
                        <SelectItem value="7d">7 derniers jours</SelectItem>
                        <SelectItem value="30d">30 derniers jours</SelectItem>
                        <SelectItem value="3m">3 derniers mois</SelectItem>
                        <SelectItem value="12m">12 derniers mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de rapport</label>
                    <Select defaultValue="summary">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">📋 Résumé exécutif</SelectItem>
                        <SelectItem value="detailed">📊 Analyse détaillée</SelectItem>
                        <SelectItem value="comparison">📈 Comparaison</SelectItem>
                        <SelectItem value="trend">📉 Analyse de tendances</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Plateformes à inclure</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['TikTok', 'Facebook', 'Instagram', 'Twitter', 'YouTube', 'Google', 'Web'].map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 Contenu du rapport</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Résumé des mentions et engagement par plateforme</li>
                  <li>• Analyse de sentiment détaillée</li>
                  <li>• Top des mots-clés et hashtags</li>
                  <li>• Graphiques et visualisations</li>
                  <li>• Recommandations stratégiques</li>
                  <li>• Export PDF et Excel disponibles</li>
                </ul>
              </div>

              <Button onClick={generateReport} className="w-full" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                Générer le rapport
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getTypeIcon(report.type)}</span>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)} {report.status === 'ready' ? 'Prêt' : 
                                                           report.status === 'generating' ? 'En cours' : 'Erreur'}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(report.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span>Période: {report.period}</span>
                          <span>Plateformes: {report.platforms.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === 'ready' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReport(report)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-1" />
                            Partager
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReport(report.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {reports.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun rapport généré</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par générer votre premier rapport d'analyse
                  </p>
                  <Button>
                    Générer un rapport
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Analyses et métriques</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData && (
                <div className="space-y-6">
                  {/* Répartition par plateforme */}
                  <div>
                    <h4 className="font-medium mb-3">📊 Répartition par plateforme</h4>
                    <div className="space-y-2">
                      {Object.entries(reportData.platform_breakdown).map(([platform, count]) => (
                        <div key={platform} className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <span className="font-medium">{platform}</span>
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(count / reportData.total_mentions) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top mots-clés */}
                  <div>
                    <h4 className="font-medium mb-3">🔥 Top mots-clés</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData.top_keywords.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">#{item.keyword}</span>
                          <Badge variant="outline">{item.count} mentions</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statistiques d'engagement */}
                  <div>
                    <h4 className="font-medium mb-3">❤️ Engagement</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">
                          {reportData.engagement_stats.total_likes.toLocaleString()}
                        </p>
                        <p className="text-sm text-red-700">Likes</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {reportData.engagement_stats.total_comments.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">Commentaires</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {reportData.engagement_stats.total_shares.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-700">Partages</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Information sur l'intégration */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-medium mb-3">🚀 Rapports automatisés connectés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📡 Sources de données</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 30+ APIs Yimba Pulse harmonisées</li>
                <li>• Données temps réel et historiques</li>
                <li>• Filtres avancés et segmentation</li>
                <li>• Géolocalisation et démographie</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 Formats de sortie</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• PDF exécutif avec graphiques</li>
                <li>• Excel détaillé avec données brutes</li>
                <li>• Dashboards interactifs en ligne</li>
                <li>• Rapports automatiques programmés</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
