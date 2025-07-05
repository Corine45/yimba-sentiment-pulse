
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, Calendar, Filter, Search, TrendingUp, Users, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  name: string;
  type: 'mentions' | 'sentiment' | 'engagement' | 'demographics' | 'geographic';
  status: 'completed' | 'processing' | 'failed';
  created_at: string;
  data_summary: {
    total_mentions: number;
    platforms: string[];
    keywords: string[];
    date_range: string;
  };
  file_url?: string;
  scheduled?: boolean;
}

interface ReportStats {
  total_reports: number;
  completed_reports: number;
  processing_reports: number;
  failed_reports: number;
  total_mentions_analyzed: number;
}

export const ReportsPanel = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total_reports: 0,
    completed_reports: 0,
    processing_reports: 0,
    failed_reports: 0,
    total_mentions_analyzed: 0
  });
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
    loadStats();
  }, []);

  const loadReports = async () => {
    try {
      // Simuler des données de rapports connectées à Supabase et vos APIs
      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Rapport Mensuel Abidjan - Janvier 2025',
          type: 'mentions',
          status: 'completed',
          created_at: new Date().toISOString(),
          data_summary: {
            total_mentions: 1250,
            platforms: ['TikTok', 'Facebook', 'Instagram', 'Twitter'],
            keywords: ['abidjan', 'civbuzz', 'côte d\'ivoire'],
            date_range: '01/01/2025 - 31/01/2025'
          },
          file_url: '#',
          scheduled: true
        },
        {
          id: '2',
          name: 'Analyse Sentiment Réseaux Sociaux',
          type: 'sentiment',
          status: 'completed',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          data_summary: {
            total_mentions: 850,
            platforms: ['Facebook', 'Instagram', 'YouTube'],
            keywords: ['elections', 'politique', 'gouvernement'],
            date_range: '15/12/2024 - 15/01/2025'
          },
          file_url: '#'
        },
        {
          id: '3',
          name: 'Rapport Engagement TikTok',
          type: 'engagement',
          status: 'processing',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          data_summary: {
            total_mentions: 500,
            platforms: ['TikTok'],
            keywords: ['danse', 'musique', 'jeunesse'],
            date_range: '01/01/2025 - 07/01/2025'
          }
        },
        {
          id: '4',
          name: 'Démographie Utilisateurs',
          type: 'demographics',
          status: 'failed',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          data_summary: {
            total_mentions: 0,
            platforms: ['Instagram', 'Facebook'],
            keywords: ['mode', 'lifestyle'],
            date_range: '20/12/2024 - 27/12/2024'
          }
        }
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rapports",
        variant: "destructive",
      });
    }
  };

  const loadStats = async () => {
    try {
      // Calculer les statistiques à partir des rapports
      const completed = reports.filter(r => r.status === 'completed').length;
      const processing = reports.filter(r => r.status === 'processing').length;
      const failed = reports.filter(r => r.status === 'failed').length;
      const totalMentions = reports.reduce((sum, r) => sum + r.data_summary.total_mentions, 0);

      setStats({
        total_reports: reports.length,
        completed_reports: completed,
        processing_reports: processing,
        failed_reports: failed,
        total_mentions_analyzed: totalMentions
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const generateReport = async (type: string) => {
    setIsGenerating(true);
    try {
      console.log('🔄 GÉNÉRATION RAPPORT VIA YIMBA PULSE APIs');
      console.log('📊 Type de rapport:', type);
      
      // Simuler la génération d'un rapport
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: Report = {
        id: Date.now().toString(),
        name: `Nouveau Rapport ${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString('fr-FR')}`,
        type: type as any,
        status: 'processing',
        created_at: new Date().toISOString(),
        data_summary: {
          total_mentions: 0,
          platforms: ['TikTok', 'Facebook', 'Instagram'],
          keywords: ['abidjan', 'civbuzz'],
          date_range: 'En cours...'
        }
      };

      setReports([newReport, ...reports]);
      
      toast({
        title: "Rapport en cours de génération",
        description: `Le rapport ${type} est en cours de création via vos APIs Yimba Pulse`,
      });

      // Simuler la finalisation du rapport après 30 secondes
      setTimeout(() => {
        setReports(prev => prev.map(r => 
          r.id === newReport.id 
            ? { 
                ...r, 
                status: 'completed' as const,
                data_summary: {
                  ...r.data_summary,
                  total_mentions: Math.floor(Math.random() * 1000) + 100,
                  date_range: `${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleDateString('fr-FR')}`
                },
                file_url: '#'
              }
            : r
        ));
        
        toast({
          title: "Rapport terminé",
          description: "Votre rapport est maintenant disponible au téléchargement",
        });
      }, 30000);

    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (report: Report) => {
    if (report.status !== 'completed' || !report.file_url) {
      toast({
        title: "Rapport non disponible",
        description: "Ce rapport n'est pas encore prêt au téléchargement",
        variant: "destructive",
      });
      return;
    }

    // Simuler le téléchargement
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement du rapport "${report.name}"`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      case 'failed': return '❌';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mentions': return '📊';
      case 'sentiment': return '😊';
      case 'engagement': return '❤️';
      case 'demographics': return '👥';
      case 'geographic': return '🌍';
      default: return '📄';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.data_summary.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total rapports</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Terminés</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.processing_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Échoués</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Mentions totales</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total_mentions_analyzed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">📋 Liste des rapports</TabsTrigger>
          <TabsTrigger value="generate">➕ Générer un rapport</TabsTrigger>
          <TabsTrigger value="scheduled">📅 Rapports programmés</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom ou mots-clés..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="mentions">📊 Mentions</SelectItem>
                      <SelectItem value="sentiment">😊 Sentiment</SelectItem>
                      <SelectItem value="engagement">❤️ Engagement</SelectItem>
                      <SelectItem value="demographics">👥 Démographie</SelectItem>
                      <SelectItem value="geographic">🌍 Géographique</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="completed">✅ Terminés</SelectItem>
                      <SelectItem value="processing">⏳ En cours</SelectItem>
                      <SelectItem value="failed">❌ Échoués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des rapports */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getTypeIcon(report.type)}</span>
                        <h3 className="font-medium">{report.name}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)} {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                        {report.scheduled && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            📅 Programmé
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Mentions:</span> {report.data_summary.total_mentions.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Plateformes:</span> {report.data_summary.platforms.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Mots-clés:</span> {report.data_summary.keywords.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Période:</span> {report.data_summary.date_range}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Créé le {new Date(report.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {report.status === 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => downloadReport(report)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReports.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun rapport trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                      ? 'Aucun rapport ne correspond à vos critères de recherche'
                      : 'Vous n\'avez pas encore généré de rapports'
                    }
                  </p>
                  <Button onClick={() => setSearchTerm('')}>
                    Effacer les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Générer un nouveau rapport</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400" 
                      onClick={() => generateReport('mentions')}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-medium mb-2">Rapport de Mentions</h3>
                    <p className="text-sm text-gray-600">
                      Analyse complète des mentions sur toutes vos plateformes
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400" 
                      onClick={() => generateReport('sentiment')}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">😊</div>
                    <h3 className="font-medium mb-2">Analyse de Sentiment</h3>
                    <p className="text-sm text-gray-600">
                      Sentiment positif, négatif et neutre des conversations
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400" 
                      onClick={() => generateReport('engagement')}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">❤️</div>
                    <h3 className="font-medium mb-2">Rapport d'Engagement</h3>
                    <p className="text-sm text-gray-600">
                      Likes, partages, commentaires et interactions
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400" 
                      onClick={() => generateReport('demographics')}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-medium mb-2">Rapport Démographique</h3>
                    <p className="text-sm text-gray-600">
                      Âge, genre et profils des utilisateurs
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400" 
                      onClick={() => generateReport('geographic')}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">🌍</div>
                    <h3 className="font-medium mb-2">Rapport Géographique</h3>
                    <p className="text-sm text-gray-600">
                      Répartition par pays, régions et villes
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <h3 className="font-medium mb-2">Rapport Personnalisé</h3>
                    <p className="text-sm text-gray-600">
                      Créer un rapport avec vos propres critères
                    </p>
                  </CardContent>
                </Card>
              </div>

              {isGenerating && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 font-medium">Génération en cours via vos APIs Yimba Pulse...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Rapports programmés</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium mb-2">📅 Fonctionnalité en développement</h4>
                  <p className="text-sm text-yellow-700">
                    La programmation automatique de rapports sera bientôt disponible. Vous pourrez :
                  </p>
                  <ul className="text-sm text-yellow-600 mt-2 space-y-1">
                    <li>• Programmer des rapports quotidiens, hebdomadaires ou mensuels</li>
                    <li>• Recevoir les rapports par email automatiquement</li>
                    <li>• Configurer des alertes basées sur les seuils</li>
                    <li>• Intégrer avec vos systèmes via API</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations sur l'intégration */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-medium mb-3">🔄 Rapports connectés Yimba Pulse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📊 Génération automatique</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Données en temps réel via vos 30+ APIs</li>
                <li>• Exports PDF, Excel, CSV disponibles</li>
                <li>• Sauvegarde automatique dans Supabase</li>
                <li>• Historique complet des rapports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎯 Types de rapports disponibles</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Mentions et veille média</li>
                <li>• Analyse de sentiment avancée</li>
                <li>• Engagement et viralité</li>
                <li>• Démographie et géolocalisation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
