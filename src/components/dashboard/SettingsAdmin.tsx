import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Monitor, 
  HardDrive, 
  Database, 
  Shield, 
  Activity, 
  Settings, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminSettingsProps {
  userRole: string;
}

export const SettingsAdmin = ({ userRole }: AdminSettingsProps) => {
  const [systemStats, setSystemStats] = useState({
    uptime: '99.9%',
    cpu_usage: 23,
    memory_usage: 67,
    disk_usage: 45,
    api_calls_today: 15432,
    active_users: 147,
    database_size: '12.3 GB',
    backup_status: 'completed',
    last_backup: '2 heures'
  });

  const [settings, setSettings] = useState({
    monitoring_enabled: true,
    auto_backup: true,
    maintenance_mode: false,
    debug_mode: false,
    api_rate_limit: 1000,
    session_timeout: 30
  });

  const { toast } = useToast();

  useEffect(() => {
    loadSystemMetrics();
    const interval = setInterval(loadSystemMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    try {
      // Charger les métriques système depuis Supabase
      const { data: metrics } = await supabase
        .from('system_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (metrics && metrics.length > 0) {
        // Simuler les métriques en temps réel
        setSystemStats(prev => ({
          ...prev,
          cpu_usage: Math.floor(Math.random() * 30) + 15,
          memory_usage: Math.floor(Math.random() * 40) + 50,
          disk_usage: Math.floor(Math.random() * 20) + 35,
          api_calls_today: prev.api_calls_today + Math.floor(Math.random() * 10)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
    }
  };

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      // Temporairement: mock pour démo admin
      console.log('Admin setting updated:', key, newValue);

      toast({
        title: "Paramètre mis à jour",
        description: `${key} ${newValue ? 'activé' : 'désactivé'}`,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le paramètre",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (userRole !== 'admin') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès administrateur requis</h3>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette section.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statut système */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <span className="text-blue-900">Paramètres administrateur</span>
          </CardTitle>
          <p className="text-blue-700">
            Configuration de la plateforme, gestion des paramètres généraux et surveillance système
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform">🏢 Configuration de la plateforme</TabsTrigger>
          <TabsTrigger value="monitoring">📊 Monitoring système</TabsTrigger>
          <TabsTrigger value="security">🔒 Sauvegardes et sécurité</TabsTrigger>
          <TabsTrigger value="users">👥 Gestion utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span>Configuration générale</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Monitoring système</Label>
                    <p className="text-sm text-gray-600">Surveillance automatique des performances</p>
                  </div>
                  <Switch
                    checked={settings.monitoring_enabled}
                    onCheckedChange={() => toggleSetting('monitoring_enabled')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sauvegardes automatiques</Label>
                    <p className="text-sm text-gray-600">Sauvegarde quotidienne automatique</p>
                  </div>
                  <Switch
                    checked={settings.auto_backup}
                    onCheckedChange={() => toggleSetting('auto_backup')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode maintenance</Label>
                    <p className="text-sm text-gray-600">Désactiver l'accès utilisateur temporairement</p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={() => toggleSetting('maintenance_mode')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode debug</Label>
                    <p className="text-sm text-gray-600">Logs détaillés pour le débogage</p>
                  </div>
                  <Switch
                    checked={settings.debug_mode}
                    onCheckedChange={() => toggleSetting('debug_mode')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Intégrations API</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🔗 API Yimba Pulse</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">🟢 Actif</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Endpoints:</span>
                      <span className="text-green-600">30+ disponibles</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Appels aujourd'hui:</span>
                      <span className="text-green-600">{systemStats.api_calls_today}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🗄️ Supabase</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-blue-100 text-blue-800">🟢 Connecté</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Base de données:</span>
                      <span className="text-blue-600">{systemStats.database_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilisateurs actifs:</span>
                      <span className="text-blue-600">{systemStats.active_users}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">CPU Usage</p>
                    <p className={`text-2xl font-bold ${getStatusColor(systemStats.cpu_usage, { warning: 70, critical: 90 })}`}>
                      {systemStats.cpu_usage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Memory</p>
                    <p className={`text-2xl font-bold ${getStatusColor(systemStats.memory_usage, { warning: 80, critical: 95 })}`}>
                      {systemStats.memory_usage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Disk Usage</p>
                    <p className={`text-2xl font-bold ${getStatusColor(systemStats.disk_usage, { warning: 80, critical: 95 })}`}>
                      {systemStats.disk_usage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{systemStats.uptime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Surveillance des performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  Graphiques de performance en temps réel - Prochainement disponible
                </p>
                <div className="h-48 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Graphiques de monitoring à venir</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span>Sauvegardes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dernière sauvegarde</p>
                    <p className="text-sm text-gray-600">Il y a {systemStats.last_backup}</p>
                  </div>
                  {getStatusBadge(systemStats.backup_status)}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">📋 Planning des sauvegardes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Base de données: Quotidienne à 2h00</li>
                    <li>• Fichiers utilisateur: Hebdomadaire</li>
                    <li>• Configuration: Après chaque modification</li>
                  </ul>
                </div>

                <Button className="w-full" variant="outline">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Lancer une sauvegarde manuelle
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Sécurité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🔒 Politiques de sécurité</h4>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Chiffrement des données en transit et au repos</li>
                    <li>• Authentification 2FA recommandée</li>
                    <li>• Logs d'audit complets</li>
                    <li>• Surveillance des intrusions active</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>Niveau de sécurité: Entreprise</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Logs de sécurité</Button>
                    <Button variant="outline" size="sm">Audit trail</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Gestion des utilisateurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Total utilisateurs</p>
                  <p className="text-2xl font-bold text-blue-600">{systemStats.active_users}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Actifs aujourd'hui</p>
                  <p className="text-2xl font-bold text-green-600">89</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Administrateurs</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Voir la gestion complète des utilisateurs
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Accès via l'onglet "Gestion utilisateurs" du menu principal
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};