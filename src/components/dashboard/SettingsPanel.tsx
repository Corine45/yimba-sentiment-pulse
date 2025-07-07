
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Bell, Shield, Zap, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsConfig {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  maxRetries: number;
  cacheEnabled: boolean;
  cacheDuration: number;
  
  // Search Settings
  defaultResultsPerPage: number;
  maxResultsPerPlatform: number;
  enableParallelSearch: boolean;
  autoRefreshResults: boolean;
  
  // Notifications
  enableNotifications: boolean;
  notifyOnSearchComplete: boolean;
  notifyOnErrors: boolean;
  emailNotifications: boolean;
  
  // Performance
  enableOptimizations: boolean;
  preloadData: boolean;
  compressResults: boolean;
  
  // Security
  enableDataEncryption: boolean;
  sessionTimeout: number;
  auditLogs: boolean;
}

export const SettingsPanel = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsConfig>({
    // API Configuration
    apiBaseUrl: 'https://yimbapulseapi.a-car.ci',
    apiTimeout: 30000,
    maxRetries: 3,
    cacheEnabled: true,
    cacheDuration: 10,
    
    // Search Settings
    defaultResultsPerPage: 25,
    maxResultsPerPlatform: 150,
    enableParallelSearch: true,
    autoRefreshResults: false,
    
    // Notifications
    enableNotifications: true,
    notifyOnSearchComplete: true,
    notifyOnErrors: true,
    emailNotifications: false,
    
    // Performance
    enableOptimizations: true,
    preloadData: false,
    compressResults: true,
    
    // Security
    enableDataEncryption: true,
    sessionTimeout: 30,
    auditLogs: true
  });

  const [activeTab, setActiveTab] = useState('api');

  const handleSettingChange = (key: keyof SettingsConfig, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès"
    });
  };

  const resetSettings = () => {
    const defaultSettings: SettingsConfig = {
      apiBaseUrl: 'https://yimbapulseapi.a-car.ci',
      apiTimeout: 30000,
      maxRetries: 3,
      cacheEnabled: true,
      cacheDuration: 10,
      defaultResultsPerPage: 25,
      maxResultsPerPlatform: 150,
      enableParallelSearch: true,
      autoRefreshResults: false,
      enableNotifications: true,
      notifyOnSearchComplete: true,
      notifyOnErrors: true,
      emailNotifications: false,
      enableOptimizations: true,
      preloadData: false,
      compressResults: true,
      enableDataEncryption: true,
      sessionTimeout: 30,
      auditLogs: true
    };
    
    setSettings(defaultSettings);
    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres par défaut ont été restaurés"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Paramètres Avancés</span>
          </h2>
          <p className="text-gray-600">
            Configuration de votre système de veille et monitoring
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetSettings}>
            Réinitialiser
          </Button>
          <Button onClick={saveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="api">🔗 API</TabsTrigger>
          <TabsTrigger value="search">🔍 Recherche</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
          <TabsTrigger value="performance">⚡ Performance</TabsTrigger>
          <TabsTrigger value="security">🔒 Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Configuration API</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>URL de base de l'API</Label>
                <Input
                  value={settings.apiBaseUrl}
                  onChange={(e) => handleSettingChange('apiBaseUrl', e.target.value)}
                  placeholder="https://yimbapulseapi.a-car.ci"
                />
                <p className="text-xs text-gray-500">
                  URL de votre backend API pour les recherches
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timeout des requêtes (ms)</Label>
                  <Input
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nombre de tentatives</Label>
                  <Select
                    value={settings.maxRetries.toString()}
                    onValueChange={(value) => handleSettingChange('maxRetries', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 tentative</SelectItem>
                      <SelectItem value="2">2 tentatives</SelectItem>
                      <SelectItem value="3">3 tentatives</SelectItem>
                      <SelectItem value="5">5 tentatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cache activé</Label>
                  <p className="text-xs text-gray-500">Mise en cache des résultats pour améliorer les performances</p>
                </div>
                <Switch
                  checked={settings.cacheEnabled}
                  onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                />
              </div>

              {settings.cacheEnabled && (
                <div className="space-y-2">
                  <Label>Durée du cache (minutes)</Label>
                  <div className="px-3">
                    <Slider
                      value={[settings.cacheDuration]}
                      onValueChange={(value) => handleSettingChange('cacheDuration', value[0])}
                      min={1}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 min</span>
                      <span>{settings.cacheDuration} minutes</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Recherche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Résultats par page</Label>
                  <Select
                    value={settings.defaultResultsPerPage.toString()}
                    onValueChange={(value) => handleSettingChange('defaultResultsPerPage', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 résultats</SelectItem>
                      <SelectItem value="25">25 résultats</SelectItem>
                      <SelectItem value="50">50 résultats</SelectItem>
                      <SelectItem value="100">100 résultats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max résultats par plateforme</Label>
                  <Input
                    type="number"
                    value={settings.maxResultsPerPlatform}
                    onChange={(e) => handleSettingChange('maxResultsPerPlatform', parseInt(e.target.value))}
                    min={50}
                    max={500}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Recherche parallèle</Label>
                  <p className="text-xs text-gray-500">Rechercher sur toutes les plateformes simultanément</p>
                </div>
                <Switch
                  checked={settings.enableParallelSearch}
                  onCheckedChange={(checked) => handleSettingChange('enableParallelSearch', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Actualisation automatique</Label>
                  <p className="text-xs text-gray-500">Actualiser les résultats automatiquement</p>
                </div>
                <Switch
                  checked={settings.autoRefreshResults}
                  onCheckedChange={(checked) => handleSettingChange('autoRefreshResults', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications activées</Label>
                  <p className="text-xs text-gray-500">Activer toutes les notifications</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                />
              </div>

              {settings.enableNotifications && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fin de recherche</Label>
                      <p className="text-xs text-gray-500">Notifier quand une recherche est terminée</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnSearchComplete}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnSearchComplete', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Erreurs</Label>
                      <p className="text-xs text-gray-500">Notifier en cas d'erreur</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnErrors}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnErrors', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications par email</Label>
                      <p className="text-xs text-gray-500">Recevoir les notifications par email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Optimisations Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Optimisations activées</Label>
                  <p className="text-xs text-gray-500">Activer les optimisations de performance</p>
                </div>
                <Switch
                  checked={settings.enableOptimizations}
                  onCheckedChange={(checked) => handleSettingChange('enableOptimizations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Préchargement des données</Label>
                  <p className="text-xs text-gray-500">Précharger les données fréquemment utilisées</p>
                </div>
                <Switch
                  checked={settings.preloadData}
                  onCheckedChange={(checked) => handleSettingChange('preloadData', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Compression des résultats</Label>
                  <p className="text-xs text-gray-500">Compresser les gros volumes de données</p>
                </div>
                <Switch
                  checked={settings.compressResults}
                  onCheckedChange={(checked) => handleSettingChange('compressResults', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Chiffrement des données</Label>
                  <p className="text-xs text-gray-500">Chiffrer les données sensibles</p>
                </div>
                <Switch
                  checked={settings.enableDataEncryption}
                  onCheckedChange={(checked) => handleSettingChange('enableDataEncryption', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Timeout de session (minutes)</Label>
                <div className="px-3">
                  <Slider
                    value={[settings.sessionTimeout]}
                    onValueChange={(value) => handleSettingChange('sessionTimeout', value[0])}
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>{settings.sessionTimeout} minutes</span>
                    <span>120 min</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Journaux d'audit</Label>
                  <p className="text-xs text-gray-500">Enregistrer les actions utilisateur</p>
                </div>
                <Switch
                  checked={settings.auditLogs}
                  onCheckedChange={(checked) => handleSettingChange('auditLogs', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Résumé des paramètres actifs */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de la Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{settings.maxResultsPerPlatform}</div>
              <div className="text-xs text-gray-600">Max résultats/plateforme</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{settings.cacheDuration}min</div>
              <div className="text-xs text-gray-600">Durée du cache</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{settings.defaultResultsPerPage}</div>
              <div className="text-xs text-gray-600">Résultats par page</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{settings.sessionTimeout}min</div>
              <div className="text-xs text-gray-600">Timeout session</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
