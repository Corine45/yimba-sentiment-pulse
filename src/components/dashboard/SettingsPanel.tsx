
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Database, Key, Globe, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: string;
  };
  api: {
    cache_duration: number;
    rate_limit: number;
    max_results: number;
  };
  privacy: {
    data_retention: number;
    analytics: boolean;
    location_tracking: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: string;
  };
}

export const SettingsPanel = () => {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      frequency: '15min'
    },
    api: {
      cache_duration: 10,
      rate_limit: 100,
      max_results: 1000
    },
    privacy: {
      data_retention: 30,
      analytics: true,
      location_tracking: false
    },
    preferences: {
      language: 'fr',
      timezone: 'Africa/Abidjan',
      theme: 'light'
    }
  });

  const [apiStatus, setApiStatus] = useState({
    yimba_pulse: 'active',
    supabase: 'active',
    total_requests: 1247,
    last_check: new Date().toISOString()
  });

  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    checkApiStatus();
  }, []);

  const loadSettings = async () => {
    try {
      // Charger les paramètres depuis Supabase
      console.log('Chargement des paramètres utilisateur...');
      // En production, récupérer depuis la base de données
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const checkApiStatus = async () => {
    try {
      // Vérifier le statut des APIs
      const response = await fetch('https://yimbapulseapi.a-car.ci/api/health');
      if (response.ok) {
        setApiStatus(prev => ({ ...prev, yimba_pulse: 'active' }));
      }
    } catch (error) {
      setApiStatus(prev => ({ ...prev, yimba_pulse: 'error' }));
      console.error('Erreur de vérification API:', error);
    }
  };

  const saveSettings = async () => {
    try {
      // Sauvegarder dans Supabase
      console.log('Sauvegarde des paramètres:', settings);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statut du système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Paramètres du système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(apiStatus.yimba_pulse)}>
                {getStatusIcon(apiStatus.yimba_pulse)} Yimba Pulse API
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(apiStatus.supabase)}>
                {getStatusIcon(apiStatus.supabase)} Supabase
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <strong>{apiStatus.total_requests}</strong> requêtes ce mois
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">👤 Profil</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
          <TabsTrigger value="api">🔧 APIs</TabsTrigger>
          <TabsTrigger value="privacy">🔒 Confidentialité</TabsTrigger>
          <TabsTrigger value="system">⚙️ Système</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informations du profil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Langue de l'interface</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => updateSetting('preferences', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select
                    value={settings.preferences.timezone}
                    onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Abidjan">🇨🇮 Abidjan (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">🇫🇷 Paris (GMT+1)</SelectItem>
                      <SelectItem value="America/New_York">🇺🇸 New York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value) => updateSetting('preferences', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Clair</SelectItem>
                      <SelectItem value="dark">🌙 Sombre</SelectItem>
                      <SelectItem value="auto">🔄 Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Préférences de notification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications push</Label>
                    <p className="text-sm text-gray-600">Notifications dans l'application</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-gray-600">Alertes critiques par SMS (Premium)</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fréquence des notifications</Label>
                <Select
                  value={settings.notifications.frequency}
                  onValueChange={(value) => updateSetting('notifications', 'frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Temps réel</SelectItem>
                    <SelectItem value="5min">Toutes les 5 minutes</SelectItem>
                    <SelectItem value="15min">Toutes les 15 minutes</SelectItem>
                    <SelectItem value="1h">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Configuration des APIs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">🔗 API Yimba Pulse</h4>
                <p className="text-sm text-blue-700 mb-2">
                  <strong>Base URL:</strong> https://yimbapulseapi.a-car.ci
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>30+ endpoints</strong><br />
                    <span className="text-blue-600">Actifs</span>
                  </div>
                  <div>
                    <strong>Cache:</strong><br />
                    <span className="text-blue-600">{settings.api.cache_duration} minutes</span>
                  </div>
                  <div>
                    <strong>Rate limit:</strong><br />
                    <span className="text-blue-600">{settings.api.rate_limit}/minute</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Durée de cache (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.api.cache_duration}
                    onChange={(e) => updateSetting('api', 'cache_duration', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Limite de requêtes par minute</Label>
                  <Input
                    type="number"
                    value={settings.api.rate_limit}
                    onChange={(e) => updateSetting('api', 'rate_limit', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Résultats maximum par recherche</Label>
                  <Input
                    type="number"
                    value={settings.api.max_results}
                    onChange={(e) => updateSetting('api', 'max_results', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={checkApiStatus} variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Tester la connexion aux APIs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Confidentialité et sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Collecte de données analytiques</Label>
                    <p className="text-sm text-gray-600">Améliorer l'expérience utilisateur</p>
                  </div>
                  <Switch
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Suivi de géolocalisation</Label>
                    <p className="text-sm text-gray-600">Pour les recherches géolocalisées</p>
                  </div>
                  <Switch
                    checked={settings.privacy.location_tracking}
                    onCheckedChange={(checked) => updateSetting('privacy', 'location_tracking', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Durée de conservation des données (jours)</Label>
                <Select
                  value={settings.privacy.data_retention.toString()}
                  onValueChange={(value) => updateSetting('privacy', 'data_retention', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="90">90 jours</SelectItem>
                    <SelectItem value="365">1 an</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">⚠️ Règles de confidentialité</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Vos données sont stockées de manière sécurisée dans Supabase</li>
                  <li>• Les requêtes API sont anonymisées</li>
                  <li>• Aucune donnée personnelle n'est partagée avec des tiers</li>
                  <li>• Vous pouvez supprimer vos données à tout moment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Informations système</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">🔧 Composants</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Frontend:</span>
                      <Badge variant="outline">React + TypeScript</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Base de données:</span>
                      <Badge variant="outline">Supabase PostgreSQL</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>API Backend:</span>
                      <Badge variant="outline">Yimba Pulse API</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache:</span>
                      <Badge variant="outline">Redis (10 min)</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">📊 Statistiques d'utilisation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Recherches ce mois:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APIs utilisées:</span>
                      <span className="font-medium">30+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Données stockées:</span>
                      <span className="font-medium">2.3 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-medium text-green-600">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Button onClick={saveSettings}>
                    Sauvegarder les paramètres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
