
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertTriangle, TrendingUp, Eye, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HealthAlert {
  id: string;
  keyword: string;
  region: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  content: string;
  timestamp: string;
  verified: boolean;
  mentions_count: number;
}

interface HealthTrend {
  date: string;
  mentions: number;
  sentiment: number;
  regions_affected: string[];
}

export const HealthSurveillance = () => {
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [trends, setTrends] = useState<HealthTrend[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      // Simuler des données de veille sanitaire connectées à Supabase et APIs
      const mockAlerts: HealthAlert[] = [
        {
          id: '1',
          keyword: 'grippe',
          region: 'Abidjan',
          severity: 'medium',
          source: 'Facebook',
          content: 'Beaucoup de cas de grippe signalés dans le quartier de Marcory',
          timestamp: new Date().toISOString(),
          verified: false,
          mentions_count: 15
        },
        {
          id: '2',
          keyword: 'paludisme',
          region: 'Bouaké',
          severity: 'high',
          source: 'Twitter',
          content: 'Augmentation des cas de paludisme à Bouaké selon plusieurs témoignages',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          verified: true,
          mentions_count: 32
        },
        {
          id: '3',
          keyword: 'dengue',
          region: 'San Pedro',
          severity: 'critical',
          source: 'Instagram',
          content: 'Alerte dengue - plusieurs hospitalisations signalées',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          verified: true,
          mentions_count: 8
        }
      ];

      const mockTrends: HealthTrend[] = [
        {
          date: '2025-01-01',
          mentions: 45,
          sentiment: -0.2,
          regions_affected: ['Abidjan', 'Bouaké']
        },
        {
          date: '2025-01-02',
          mentions: 62,
          sentiment: -0.4,
          regions_affected: ['Abidjan', 'Bouaké', 'San Pedro']
        },
        {
          date: '2025-01-03',
          mentions: 38,
          sentiment: -0.1,
          regions_affected: ['Abidjan']
        }
      ];

      setHealthAlerts(mockAlerts);
      setTrends(mockTrends);
    } catch (error) {
      console.error('Erreur lors du chargement des données de santé:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de veille sanitaire",
        variant: "destructive",
      });
    }
  };

  const verifyAlert = async (id: string) => {
    setHealthAlerts(alerts =>
      alerts.map(alert =>
        alert.id === id ? { ...alert, verified: true } : alert
      )
    );
    toast({
      title: "Alerte vérifiée",
      description: "L'alerte a été marquée comme vérifiée",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const filteredAlerts = healthAlerts.filter(alert => {
    const matchesSearch = alert.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || alert.region === selectedRegion;
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return matchesSearch && matchesRegion && matchesSeverity;
  });

  const criticalCount = healthAlerts.filter(alert => alert.severity === 'critical').length;
  const highCount = healthAlerts.filter(alert => alert.severity === 'high').length;
  const unverifiedCount = healthAlerts.filter(alert => !alert.verified).length;
  const totalMentions = healthAlerts.reduce((sum, alert) => sum + alert.mentions_count, 0);

  return (
    <div className="space-y-6">
      {/* Tableau de bord des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Alertes critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Priorité haute</p>
                <p className="text-2xl font-bold text-orange-600">{highCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Non vérifiées</p>
                <p className="text-2xl font-bold text-blue-600">{unverifiedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total mentions</p>
                <p className="text-2xl font-bold text-green-600">{totalMentions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">🚨 Alertes sanitaires</TabsTrigger>
          <TabsTrigger value="trends">📊 Tendances</TabsTrigger>
          <TabsTrigger value="map">🗺️ Carte régionale</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par mot-clé, région ou contenu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes régions</SelectItem>
                      <SelectItem value="Abidjan">Abidjan</SelectItem>
                      <SelectItem value="Bouaké">Bouaké</SelectItem>
                      <SelectItem value="San Pedro">San Pedro</SelectItem>
                      <SelectItem value="Yamoussoukro">Yamoussoukro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sévérité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="critical">🔴 Critique</SelectItem>
                      <SelectItem value="high">🟠 Haute</SelectItem>
                      <SelectItem value="medium">🟡 Moyenne</SelectItem>
                      <SelectItem value="low">🟢 Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des alertes */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {getSeverityIcon(alert.severity)} {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {alert.region}
                        </Badge>
                        <Badge variant="outline">{alert.source}</Badge>
                        {alert.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            ✅ Vérifiée
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">
                        Mot-clé: "{alert.keyword}"
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{alert.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(alert.timestamp).toLocaleString('fr-FR')}
                        </span>
                        <span className="flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          {alert.mentions_count} mentions
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {!alert.verified && (
                        <Button
                          size="sm"
                          onClick={() => verifyAlert(alert.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Vérifier
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

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune alerte trouvée</h3>
                  <p className="text-gray-600">
                    Aucune alerte sanitaire ne correspond à vos critères de recherche
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Tendances sanitaires</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(trend.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600">
                        Régions affectées: {trend.regions_affected.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{trend.mentions}</p>
                      <p className="text-sm text-gray-600">mentions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Répartition géographique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-8 rounded-lg text-center">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Carte interactive en développement</h3>
                <p className="text-blue-700 text-sm">
                  La carte géographique des alertes sanitaires sera intégrée avec vos APIs de géolocalisation 
                  et les données Supabase pour visualiser la répartition des incidents de santé par région.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations sur l'intégration */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <h3 className="font-medium mb-3">🔄 Veille sanitaire connectée</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📡 Sources de données</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• TikTok, Facebook, Instagram, Twitter</li>
                <li>• YouTube, Google Search, sites web</li>
                <li>• Blogs et forums de santé</li>
                <li>• Réseaux sociaux géolocalisés</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎯 Surveillance automatique</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Mots-clés santé prédéfinis</li>
                <li>• Détection de tendances anormales</li>
                <li>• Géolocalisation des signalements</li>
                <li>• Validation collaborative</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
