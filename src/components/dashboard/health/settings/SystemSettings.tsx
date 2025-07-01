
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Clock, Database, Bell, Download, Upload, RotateCcw, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings } from "@/hooks/useSystemSettings";

export const SystemSettings = () => {
  const { toast } = useToast();
  const { 
    settings, 
    stats, 
    loading, 
    saveSettings, 
    refreshStats,
    insertMetric 
  } = useSystemSettings();

  const handleSettingChange = (section: keyof typeof settings, field: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    };
    saveSettings(newSettings);
  };

  const handleExportConfig = () => {
    const configBlob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(configBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration exportée",
      description: "Le fichier de configuration a été téléchargé.",
    });
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        saveSettings(importedSettings);
        toast({
          title: "Configuration importée",
          description: "Les paramètres ont été restaurés avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur d'importation",
          description: "Le fichier de configuration n'est pas valide.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    const defaultSettings = {
      surveillance: {
        frequency: 15,
        maxConcurrentJobs: 5,
        retryAttempts: 3,
        timeout: 30
      },
      storage: {
        retentionPeriod: 12,
        autoArchive: true,
        compressionEnabled: true,
        maxStorageSize: 50
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        webhookEnabled: true,
        digestFrequency: "daily"
      },
      performance: {
        enableCaching: true,
        cacheExpiry: 60,
        enableCompression: true,
        maxMemoryUsage: 80
      }
    };

    saveSettings(defaultSettings);
    toast({
      title: "Paramètres réinitialisés",
      description: "La configuration par défaut a été restaurée.",
    });
  };

  const simulateMetrics = async () => {
    // Simuler l'insertion de nouvelles métriques
    await insertMetric('uptime', Math.random() * 100, '%');
    await insertMetric('memory_usage', Math.random() * 100, '%');
    await insertMetric('disk_usage', Math.random() * 100, '%');
    await insertMetric('avg_response_time', Math.random() * 1000, 'ms');
    
    toast({
      title: "Métriques simulées",
      description: "De nouvelles métriques ont été générées.",
    });
    
    // Rafraîchir les statistiques
    refreshStats();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Chargement des paramètres système...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            Paramètres système
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={refreshStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={simulateMetrics}>
              <Database className="w-4 h-4 mr-2" />
              Simuler métriques
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportConfig}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <label htmlFor="import-config">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </span>
              </Button>
            </label>
            <input
              id="import-config"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportConfig}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Statistiques système - données réelles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.uptime}</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.performance.avgResponseTime}</div>
              <div className="text-sm text-gray-600">Temps de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.database.size}</div>
              <div className="text-sm text-gray-600">Données stockées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.database.records}</div>
              <div className="text-sm text-gray-600">Enregistrements</div>
            </div>
          </div>

          {/* Configuration de surveillance */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Paramètres de surveillance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Fréquence de vérification (minutes)</Label>
                <Input
                  id="frequency"
                  type="number"
                  value={settings.surveillance.frequency}
                  onChange={(e) => handleSettingChange("surveillance", "frequency", parseInt(e.target.value))}
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <Label htmlFor="maxJobs">Tâches simultanées max</Label>
                <Input
                  id="maxJobs"
                  type="number"
                  value={settings.surveillance.maxConcurrentJobs}
                  onChange={(e) => handleSettingChange("surveillance", "maxConcurrentJobs", parseInt(e.target.value))}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="retryAttempts">Tentatives de retry</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  value={settings.surveillance.retryAttempts}
                  onChange={(e) => handleSettingChange("surveillance", "retryAttempts", parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="timeout">Timeout (secondes)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={settings.surveillance.timeout}
                  onChange={(e) => handleSettingChange("surveillance", "timeout", parseInt(e.target.value))}
                  min="5"
                  max="300"
                />
              </div>
            </div>
          </div>

          {/* Configuration de stockage */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4 flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Gestion des données
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="retention">Rétention des données (mois)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={settings.storage.retentionPeriod}
                  onChange={(e) => handleSettingChange("storage", "retentionPeriod", parseInt(e.target.value))}
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <Label htmlFor="maxStorage">Stockage max (GB)</Label>
                <Input
                  id="maxStorage"
                  type="number"
                  value={settings.storage.maxStorageSize}
                  onChange={(e) => handleSettingChange("storage", "maxStorageSize", parseInt(e.target.value))}
                  min="10"
                  max="1000"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.storage.autoArchive}
                  onCheckedChange={(checked) => handleSettingChange("storage", "autoArchive", checked)}
                />
                <Label>Archivage automatique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.storage.compressionEnabled}
                  onCheckedChange={(checked) => handleSettingChange("storage", "compressionEnabled", checked)}
                />
                <Label>Compression des données</Label>
              </div>
            </div>
          </div>

          {/* Configuration des notifications */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications système
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.notifications.emailEnabled}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "emailEnabled", checked)}
                />
                <Label>Notifications email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.notifications.smsEnabled}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "smsEnabled", checked)}
                />
                <Label>Notifications SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.notifications.webhookEnabled}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "webhookEnabled", checked)}
                />
                <Label>Webhooks</Label>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="digestFreq">Fréquence des résumés</Label>
              <select
                id="digestFreq"
                value={settings.notifications.digestFrequency}
                onChange={(e) => handleSettingChange("notifications", "digestFrequency", e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
              </select>
            </div>
          </div>

          {/* Configuration des performances */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Optimisation des performances</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cacheExpiry">Expiration du cache (minutes)</Label>
                <Input
                  id="cacheExpiry"
                  type="number"
                  value={settings.performance.cacheExpiry}
                  onChange={(e) => handleSettingChange("performance", "cacheExpiry", parseInt(e.target.value))}
                  min="5"
                  max="1440"
                />
              </div>
              <div>
                <Label htmlFor="maxMemory">Utilisation mémoire max (%)</Label>
                <Input
                  id="maxMemory"
                  type="number"
                  value={settings.performance.maxMemoryUsage}
                  onChange={(e) => handleSettingChange("performance", "maxMemoryUsage", parseInt(e.target.value))}
                  min="50"
                  max="95"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.performance.enableCaching}
                  onCheckedChange={(checked) => handleSettingChange("performance", "enableCaching", checked)}
                />
                <Label>Cache activé</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.performance.enableCompression}
                  onCheckedChange={(checked) => handleSettingChange("performance", "enableCompression", checked)}
                />
                <Label>Compression HTTP</Label>
              </div>
            </div>
          </div>

          {/* Informations système - données réelles */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-4">Informations système</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Version:</span>
                  <Badge variant="outline">{stats.version}</Badge>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Dernier redémarrage:</span>
                  <span>{stats.lastRestart}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Dernière sauvegarde:</span>
                  <span>{stats.database.lastBackup}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Utilisation mémoire:</span>
                  <span>{stats.performance.memoryUsage}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Utilisation disque:</span>
                  <span>{stats.performance.diskUsage}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Enregistrements totaux:</span>
                  <span>{stats.database.records}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions de maintenance */}
          <div className="flex justify-between items-center p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div>
              <h4 className="font-medium text-yellow-900">Actions de maintenance</h4>
              <p className="text-sm text-yellow-700">Réinitialiser la configuration aux valeurs par défaut</p>
            </div>
            <Button variant="outline" onClick={handleResetDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
