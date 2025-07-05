
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertTriangle, Shield, TrendingUp, Users, Globe, Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface HealthAlert {
  id: string;
  type: 'epidemic' | 'outbreak' | 'surveillance' | 'prevention';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  source: string;
  status: 'active' | 'monitoring' | 'resolved';
}

interface HealthSurveillanceProps {
  userRole: string;
  permissions: {
    canAnalyze: boolean;
    canExportData: boolean;
  };
}

export const HealthSurveillance = ({ userRole, permissions }: HealthSurveillanceProps) => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulation de données basées sur vos APIs de surveillance sanitaire
  useEffect(() => {
    const simulateHealthData = () => {
      const mockAlerts: HealthAlert[] = [
        {
          id: '1',
          type: 'epidemic',
          severity: 'high',
          title: 'Augmentation cas de grippe saisonnière',
          description: 'Détection via surveillance réseaux sociaux et APIs médicales - 40% d\'augmentation des mentions',
          location: 'Abidjan, Côte d\'Ivoire',
          timestamp: new Date().toISOString(),
          source: 'API Yimba Pulse + WHO Data',
          status: 'active'
        },
        {
          id: '2',
          type: 'surveillance',
          severity: 'medium',
          title: 'Surveillance dengue - Saison des pluies',
          description: 'Monitoring préventif basé sur données météo et signalements citoyens',
          location: 'Bamako, Mali',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          source: 'Réseaux sociaux + APIs météo',
          status: 'monitoring'
        },
        {
          id: '3',
          type: 'prevention',
          severity: 'low',
          title: 'Campagne vaccination détectée',
          description: 'Sentiment positif sur campagne vaccination - 85% de mentions favorables',
          location: 'Dakar, Sénégal',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          source: 'Facebook + Twitter + TikTok',
          status: 'monitoring'
        }
      ];
      setAlerts(mockAlerts);
    };

    simulateHealthData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'epidemic': return <AlertTriangle className="w-4 h-4" />;
      case 'outbreak': return <Activity className="w-4 h-4" />;
      case 'surveillance': return <Shield className="w-4 h-4" />;
      case 'prevention': return <Users className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleCreateAlert = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Nouvelle alerte créée",
        description: "Surveillance automatique activée via vos APIs",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Surveillance Sanitaire</h2>
          <p className="text-gray-600">Monitoring en temps réel via vos 30+ APIs Yimba Pulse</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Activity className="w-4 h-4 mr-1" />
            {alerts.length} Alertes actives
          </Badge>
          {permissions.canAnalyze && (
            <Button onClick={handleCreateAlert} disabled={isLoading}>
              <Bell className="w-4 h-4 mr-2" />
              Nouvelle alerte
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">🏥 Tableau de bord</TabsTrigger>
          <TabsTrigger value="alerts">🚨 Alertes</TabsTrigger>
          <TabsTrigger value="surveillance">👁️ Surveillance</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alertes Critiques</p>
                    <p className="text-2xl font-bold text-red-600">
                      {alerts.filter(a => a.severity === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En Surveillance</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {alerts.filter(a => a.status === 'monitoring').length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sources Actives</p>
                    <p className="text-2xl font-bold text-blue-600">30+</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Couverture</p>
                    <p className="text-2xl font-bold text-green-600">Afrique de l'Ouest</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Activité en Temps Réel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.location} • {alert.source}</p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestion des Alertes</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="critical">Critiques</SelectItem>
                      <SelectItem value="high">Élevées</SelectItem>
                      <SelectItem value="medium">Moyennes</SelectItem>
                      <SelectItem value="low">Faibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getTypeIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{alert.title}</h3>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>📍 {alert.location}</span>
                              <span>🔗 {alert.source}</span>
                              <span>⏰ {new Date(alert.timestamp).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveillance">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de Surveillance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sources de Données Actives</h4>
                    <div className="space-y-2">
                      {['Facebook', 'Twitter', 'TikTok', 'Instagram', 'YouTube', 'APIs WHO', 'APIs Gouvernementales'].map((source) => (
                        <div key={source} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">{source}</span>
                          <Badge className="bg-green-500 text-white">Actif</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Mots-Clés Surveillés</h4>
                    <div className="flex flex-wrap gap-2">
                      {['grippe', 'dengue', 'paludisme', 'vaccination', 'épidémie', 'santé publique', 'OMS', 'ministère santé'].map((keyword) => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analyses et Tendances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyses Avancées</h3>
                <p className="text-gray-600 mb-6">
                  Visualisations des tendances sanitaires basées sur vos données APIs
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Tendances Temporelles</h4>
                    <p className="text-sm text-blue-700 mt-2">Évolution des mentions dans le temps</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Analyse Géographique</h4>
                    <p className="text-sm text-green-700 mt-2">Répartition par région/pays</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Sentiment Analysis</h4>
                    <p className="text-sm text-purple-700 mt-2">Perception publique des enjeux santé</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
