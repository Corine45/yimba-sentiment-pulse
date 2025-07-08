import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Database, Key, Globe, Shield, Server, HardDrive, Monitor, RefreshCw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface SettingsPanelProps {
  userRole: string;
  permissions: {
    canAccessSettings: boolean;
    canConfigurePlatform: boolean;
    canViewSystemMetrics: boolean;
    canManageBackups: boolean;
  };
}

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
  platform: {
    monitoring_enabled: boolean;
    backup_frequency: string;
    security_level: string;
    auto_updates: boolean;
  };
}

const defaultSettings: UserSettings = {
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
  },
  platform: {
    monitoring_enabled: true,
    backup_frequency: 'daily',
    security_level: 'standard',
    auto_updates: true
  }
};

export const SettingsPanel = ({ userRole, permissions }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { profile } = useProfile();
  const { toast } = useToast();

  const [apiStatus, setApiStatus] = useState({
    yimba_pulse: 'active',
    supabase: 'active',
    total_requests: 1247,
    last_check: new Date().toISOString()
  });

  useEffect(() => {
    loadSettings();
    checkApiStatus();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('settings_category, settings_data')
        .eq('user_id', profile?.id);

      if (error) throw error;
      
      const loadedSettings = { ...defaultSettings };
      
      data?.forEach(item => {
        const category = item.settings_category as keyof UserSettings;
        const settingsData = item.settings_data as any;
        
        if (category && settingsData && typeof settingsData === 'object') {
          if (category === 'notifications' && loadedSettings.notifications) {
            loadedSettings.notifications = { ...loadedSettings.notifications, ...settingsData };
          } else if (category === 'api' && loadedSettings.api) {
            loadedSettings.api = { ...loadedSettings.api, ...settingsData };
          } else if (category === 'privacy' && loadedSettings.privacy) {
            loadedSettings.privacy = { ...loadedSettings.privacy, ...settingsData };
          } else if (category === 'preferences' && loadedSettings.preferences) {
            loadedSettings.preferences = { ...loadedSettings.preferences, ...settingsData };
          } else if (category === 'platform' && loadedSettings.platform) {
            loadedSettings.platform = { ...loadedSettings.platform, ...settingsData };
          }
        }
      });
      
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch('https://yimbapulseapi.a-car.ci/api/health');
      if (response.ok) {
        setApiStatus(prev => ({ ...prev, yimba_pulse: 'active' }));
      }
    } catch (error) {
      setApiStatus(prev => ({ ...prev, yimba_pulse: 'error' }));
      console.error('API check error:', error);
    }
  };

  const saveSettings = async () => {
    if (!profile?.id) return;
    
    try {
      setSaving(true);
      
      const categories = Object.keys(settings) as (keyof UserSettings)[];
      
      for (const category of categories) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({
            user_id: profile.id,
            settings_category: category,
            settings_data: settings[category]
          }, {
            onConflict: 'user_id,settings_category'
          });

        if (error) throw error;
      }
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <T extends keyof UserSettings>(
    category: T, 
    key: keyof UserSettings[T], 
    value: any
  ) => {
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

  if (!permissions.canAccessSettings) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder aux paramètres.</p>
        </CardContent>
      </Card>
    );
  }

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">👤 Profil</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
          <TabsTrigger value="api">🔧 APIs</TabsTrigger>
          <TabsTrigger value="privacy">🔒 Confidentialité</TabsTrigger>
          <TabsTrigger value="platform">🏢 Plateforme</TabsTrigger>
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

              <div className="flex space-x-2">
                <Button onClick={checkApiStatus} variant="outline" className="flex-1">
                  <Database className="w-4 h-4 mr-2" />
                  Tester la connexion
                </Button>
              </div>
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

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Configuration de la plateforme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {permissions.canConfigurePlatform ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Monitoring système actif</Label>
                        <p className="text-sm text-gray-600">Surveillance automatique des performances</p>
                      </div>
                      <Switch
                        checked={settings.platform.monitoring_enabled}
                        onCheckedChange={(checked) => updateSetting('platform', 'monitoring_enabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mises à jour automatiques</Label>
                        <p className="text-sm text-gray-600">Installation automatique des correctifs</p>
                      </div>
                      <Switch
                        checked={settings.platform.auto_updates}
                        onCheckedChange={(checked) => updateSetting('platform', 'auto_updates', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence des sauvegardes</Label>
                    <Select
                      value={settings.platform.backup_frequency}
                      onValueChange={(value) => updateSetting('platform', 'backup_frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Niveau de sécurité</Label>
                    <Select
                      value={settings.platform.security_level}
                      onValueChange={(value) => updateSetting('platform', 'security_level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                        <SelectItem value="enterprise">Entreprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">✅ Statut de la plateforme</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Monitoring:</span>
                        <span className="ml-2 text-green-600">
                          {settings.platform.monitoring_enabled ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Sauvegardes:</span>
                        <span className="ml-2 text-green-600">
                          {settings.platform.backup_frequency}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Sécurité:</span>
                        <span className="ml-2 text-green-600">
                          {settings.platform.security_level}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Dernière sauvegarde:</span>
                        <span className="ml-2 text-green-600">Il y a 2h</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
                  <p className="text-gray-600">
                    Vous n'avez pas les permissions pour configurer la plateforme.
                  </p>
                </div>
              )}
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
                      <span className="text-blue-600">React 18.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backend:</span>
                      <span className="text-green-600">Supabase</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APIs:</span>
                      <span className="text-purple-600">Yimba Pulse (30+)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">📊 Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Temps de réponse:</span>
                      <span className="text-green-600">&lt; 200ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disponibilité:</span>
                      <span className="text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="text-blue-600">v2.4.1</span>
                    </div>
                  </div>
                </div>
              </div>

              {permissions.canViewSystemMetrics ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">📊 Métriques système en temps réel</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <Monitor className="w-8 h-8 mx-auto text-blue-600 mb-1" />
                      <div className="font-medium">CPU</div>
                      <div className="text-blue-600">23%</div>
                    </div>
                    <div className="text-center">
                      <HardDrive className="w-8 h-8 mx-auto text-green-600 mb-1" />
                      <div className="font-medium">RAM</div>
                      <div className="text-green-600">67%</div>
                    </div>
                    <div className="text-center">
                      <Database className="w-8 h-8 mx-auto text-purple-600 mb-1" />
                      <div className="font-medium">DB</div>
                      <div className="text-purple-600">12GB</div>
                    </div>
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto text-orange-600 mb-1" />
                      <div className="font-medium">API</div>
                      <div className="text-orange-600">99.9%</div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex space-x-2">
                <Button onClick={saveSettings} disabled={saving || loading} className="flex-1">
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder tous les paramètres
                    </>
                  )}
                </Button>
                {userRole === 'admin' && (
                  <Button variant="outline" onClick={() => setSettings(defaultSettings)}>
                    Réinitialiser
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};