
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { SystemStatsCard } from "./components/SystemStatsCard";
import { SurveillanceSettings } from "./components/SurveillanceSettings";
import { StorageSettings } from "./components/StorageSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { PerformanceSettings } from "./components/PerformanceSettings";
import { SystemInfoCard } from "./components/SystemInfoCard";
import { SystemActions } from "./components/SystemActions";

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
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Paramètres système
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <SystemStatsCard 
            stats={stats} 
            onRefresh={refreshStats}
            onSimulateMetrics={simulateMetrics}
          />
          
          <SurveillanceSettings 
            settings={settings}
            onSettingChange={handleSettingChange}
          />
          
          <StorageSettings 
            settings={settings}
            onSettingChange={handleSettingChange}
          />
          
          <NotificationSettings 
            settings={settings}
            onSettingChange={handleSettingChange}
          />
          
          <PerformanceSettings 
            settings={settings}
            onSettingChange={handleSettingChange}
          />
          
          <SystemInfoCard stats={stats} />
          
          <SystemActions 
            settings={settings}
            onSaveSettings={saveSettings}
          />
        </div>
      </CardContent>
    </Card>
  );
};
