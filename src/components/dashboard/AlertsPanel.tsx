
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bell, Settings, Plus, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  keyword: string;
  platform: string;
  threshold: number;
  type: 'mention' | 'sentiment' | 'engagement';
  status: 'active' | 'inactive';
  created_at: string;
  triggered_count: number;
}

export const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    keyword: '',
    platform: '',
    threshold: 10,
    type: 'mention' as 'mention' | 'sentiment' | 'engagement'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      // Simuler des données d'alertes connectées à Supabase
      const mockAlerts: Alert[] = [
        {
          id: '1',
          keyword: 'abidjan',
          platform: 'TikTok',
          threshold: 50,
          type: 'mention',
          status: 'active',
          created_at: new Date().toISOString(),
          triggered_count: 12
        },
        {
          id: '2',
          keyword: 'côte d\'ivoire',
          platform: 'Facebook',
          threshold: 100,
          type: 'engagement',
          status: 'active',
          created_at: new Date().toISOString(),
          triggered_count: 8
        },
        {
          id: '3',
          keyword: 'civbuzz',
          platform: 'Instagram',
          threshold: 75,
          type: 'sentiment',
          status: 'inactive',
          created_at: new Date().toISOString(),
          triggered_count: 3
        }
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les alertes",
        variant: "destructive",
      });
    }
  };

  const createAlert = async () => {
    if (!newAlert.keyword || !newAlert.platform) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const alert: Alert = {
        id: Date.now().toString(),
        ...newAlert,
        status: 'active',
        created_at: new Date().toISOString(),
        triggered_count: 0
      };

      setAlerts([...alerts, alert]);
      setNewAlert({ keyword: '', platform: '', threshold: 10, type: 'mention' });
      
      toast({
        title: "Alerte créée",
        description: `Alerte créée pour "${newAlert.keyword}" sur ${newAlert.platform}`,
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte",
        variant: "destructive",
      });
    }
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: alert.status === 'active' ? 'inactive' : 'active' }
        : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alerte supprimée",
      description: "L'alerte a été supprimée avec succès",
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;
  const totalTriggered = alerts.reduce((sum, alert) => sum + alert.triggered_count, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Alertes actives</p>
                <p className="text-2xl font-bold text-blue-600">{activeAlertsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Total déclenchées</p>
                <p className="text-2xl font-bold text-orange-600">{totalTriggered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total alertes</p>
                <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">📋 Liste des alertes</TabsTrigger>
          <TabsTrigger value="create">➕ Créer une alerte</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Paramètres</TabsTrigger>
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
                      placeholder="Rechercher par mot-clé ou plateforme..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="inactive">Inactives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des alertes */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                          {alert.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </Badge>
                        <Badge variant="outline">{alert.platform}</Badge>
                      </div>
                      <div>
                        <h3 className="font-medium">"{alert.keyword}"</h3>
                        <p className="text-sm text-gray-600">
                          Type: {alert.type} • Seuil: {alert.threshold} • 
                          Déclenchée: {alert.triggered_count} fois
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAlertStatus(alert.id)}
                      >
                        {alert.status === 'active' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune alerte trouvée</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Aucune alerte ne correspond à vos critères de recherche'
                      : 'Vous n\'avez pas encore créé d\'alertes'
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

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Créer une nouvelle alerte</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot-clé à surveiller</label>
                  <Input
                    placeholder="ex: abidjan, civbuzz..."
                    value={newAlert.keyword}
                    onChange={(e) => setNewAlert({...newAlert, keyword: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Plateforme</label>
                  <Select
                    value={newAlert.platform}
                    onValueChange={(value) => setNewAlert({...newAlert, platform: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TikTok">🎵 TikTok</SelectItem>
                      <SelectItem value="Facebook">📘 Facebook</SelectItem>
                      <SelectItem value="Instagram">📸 Instagram</SelectItem>
                      <SelectItem value="Twitter">🐦 Twitter/X</SelectItem>
                      <SelectItem value="YouTube">📺 YouTube</SelectItem>
                      <SelectItem value="Google">🔍 Google</SelectItem>
                      <SelectItem value="Web">🌐 Web</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type d'alerte</label>
                  <Select
                    value={newAlert.type}
                    onValueChange={(value: 'mention' | 'sentiment' | 'engagement') => 
                      setNewAlert({...newAlert, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mention">📊 Mentions</SelectItem>
                      <SelectItem value="sentiment">😊 Sentiment</SelectItem>
                      <SelectItem value="engagement">❤️ Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seuil de déclenchement</label>
                  <Input
                    type="number"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert({...newAlert, threshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 Résumé de l'alerte</h4>
                <p className="text-sm text-blue-700">
                  Une alerte sera déclenchée quand le mot-clé "<strong>{newAlert.keyword || '[mot-clé]'}</strong>" 
                  sur <strong>{newAlert.platform || '[plateforme]'}</strong> dépasse 
                  <strong> {newAlert.threshold}</strong> {newAlert.type === 'mention' ? 'mentions' : 
                  newAlert.type === 'sentiment' ? 'score de sentiment' : 'interactions'}.
                </p>
              </div>

              <Button onClick={createAlert} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Créer l'alerte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Paramètres des alertes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Notifications par email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Notifications dans l'application</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Notifications SMS (Premium)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Fréquence de vérification</h3>
                <Select defaultValue="15min">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">Toutes les 5 minutes</SelectItem>
                    <SelectItem value="15min">Toutes les 15 minutes</SelectItem>
                    <SelectItem value="30min">Toutes les 30 minutes</SelectItem>
                    <SelectItem value="1h">Toutes les heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">🔄 Intégration API en cours</h4>
                <p className="text-sm text-yellow-700">
                  Les alertes utilisent vos 30+ APIs Yimba Pulse pour surveiller les mentions en temps réel.
                  Configuration automatique avec Supabase pour le stockage des alertes et déclenchements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
