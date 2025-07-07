
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, BarChart, Eye, TrendingUp, Users, MapPin, Heart, MessageSquare, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
  data?: any;
  metrics?: {
    totalMentions: number;
    positivePercentage: number;
    negativePercentage: number;
    neutralPercentage: number;
    engagement: number;
    reach: number;
  };
}

interface ReportsListProps {
  canGenerateReports: boolean;
  canExportData: boolean;
}

export const ReportsList = ({ canGenerateReports, canExportData }: ReportsListProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les rapports depuis Supabase
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data: mentionSaves, error } = await supabase
        .from('mention_saves')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedReports: Report[] = mentionSaves?.map(save => ({
        id: save.id,
        title: save.file_name.replace(/\.[^/.]+$/, ""), // Remove file extension
        description: `Analyse ${save.platforms.join(', ')} - ${save.search_keywords.join(', ')}`,
        date: new Date(save.created_at).toLocaleDateString('fr-FR'),
        type: save.export_format,
        status: "generated",
        data: save.mentions_data,
        metrics: {
          totalMentions: save.total_mentions,
          positivePercentage: Math.round((save.positive_mentions / save.total_mentions) * 100) || 0,
          negativePercentage: Math.round((save.negative_mentions / save.total_mentions) * 100) || 0,
          neutralPercentage: Math.round((save.neutral_mentions / save.total_mentions) * 100) || 0,
          engagement: save.total_engagement,
          reach: save.total_mentions * 1000 // Estimation
        }
      })) || [];

      setReports(formattedReports);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      toast.error('Erreur lors du chargement des rapports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "generated") {
      return <Badge variant="default" className="bg-green-100 text-green-800">Généré</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En cours...</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      mentions: BarChart,
      sentiment: Heart,
      engagement: MessageSquare,
      demographic: Users,
      geographic: MapPin,
      custom: FileText,
      json: FileText,
      csv: FileText,
      excel: FileText
    };
    
    const IconComponent = iconMap[type] || FileText;
    return <IconComponent className="w-4 h-4 text-primary" />;
  };

  const downloadReport = async (report: Report) => {
    try {
      if (report.data) {
        const blob = new Blob([JSON.stringify(report.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(`Rapport "${report.title}" téléchargé`);
      }
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const ReportDetails = ({ report }: { report: Report }) => {
    const mentionsData = Array.isArray(report.data) ? report.data : [];
    const topMentions = mentionsData.slice(0, 10);
    const platforms = [...new Set(mentionsData.map((m: any) => m.platform))];
    const topAuthors = Object.entries(
      mentionsData.reduce((acc: any, m: any) => {
        acc[m.author] = (acc[m.author] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 10);

    return (
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="authors">Auteurs</TabsTrigger>
          <TabsTrigger value="platforms">Plateformes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{report.metrics?.totalMentions || 0}</div>
                <div className="text-sm text-muted-foreground">Total mentions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{report.metrics?.positivePercentage || 0}%</div>
                <div className="text-sm text-muted-foreground">Positif</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{report.metrics?.negativePercentage || 0}%</div>
                <div className="text-sm text-muted-foreground">Négatif</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{report.metrics?.reach || 0}</div>
                <div className="text-sm text-muted-foreground">Portée estimée</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition des sentiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-green-600">● Positif</span>
                  <span>{report.metrics?.positivePercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${report.metrics?.positivePercentage || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-red-600">● Négatif</span>
                  <span>{report.metrics?.negativePercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${report.metrics?.negativePercentage || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">● Neutre</span>
                  <span>{report.metrics?.neutralPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-600 h-2 rounded-full" 
                    style={{ width: `${report.metrics?.neutralPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mentions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentions les plus populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topMentions.slice(0, 100).map((mention: any, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{mention.author}</p>
                        <p className="text-sm text-muted-foreground mt-1">{mention.content?.substring(0, 150)}...</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{mention.platform}</span>
                          <span>{new Date(mention.created_at).toLocaleDateString('fr-FR')}</span>
                          <Badge variant={mention.sentiment === 'positive' ? 'default' : mention.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                            {mention.sentiment}
                          </Badge>
                        </div>
                      </div>
                      {mention.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={mention.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="authors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auteurs les plus actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topAuthors.map(([author, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{author}</span>
                    </div>
                    <Badge variant="outline">{String(count)} mentions</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par plateforme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platforms.map((platform: string) => {
                  const platformMentions = mentionsData.filter((m: any) => m.platform === platform);
                  const percentage = Math.round((platformMentions.length / mentionsData.length) * 100);
                  
                  return (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{platform}</span>
                        <span>{platformMentions.length} mentions ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement des rapports...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>📋 Liste des rapports générés</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {reports.length} rapport{reports.length > 1 ? 's' : ''} disponible{reports.length > 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun rapport généré pour le moment.</p>
              <p className="text-sm">Utilisez la section "Générer un rapport" pour créer votre premier rapport.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  {getTypeIcon(report.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                      {report.metrics && (
                        <div className="flex space-x-3 text-xs">
                          <span className="text-blue-600">{report.metrics.totalMentions} mentions</span>
                          <span className="text-green-600">{report.metrics.positivePercentage}% positif</span>
                          <span className="text-red-600">{report.metrics.negativePercentage}% négatif</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Détails du rapport - {report.title}</DialogTitle>
                      </DialogHeader>
                      {selectedReport && <ReportDetails report={selectedReport} />}
                    </DialogContent>
                  </Dialog>

                  {report.status === "generated" && canExportData && (
                    <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
