
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Bell, TrendingUp, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThresholdConfig {
  id: string;
  name: string;
  type: "volume" | "sentiment" | "velocity" | "keyword";
  value: number;
  timeWindow: number; // en minutes
  isActive: boolean;
  alertLevel: "low" | "medium" | "high" | "critical";
  description: string;
}

export const ThresholdConfig = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([
    {
      id: "1",
      name: "Volume de mentions élevé",
      type: "volume",
      value: 50,
      timeWindow: 60,
      isActive: true,
      alertLevel: "medium",
      description: "Déclenche une alerte quand plus de 50 mentions sont détectées en 1 heure"
    },
    {
      id: "2",
      name: "Sentiment très négatif",
      type: "sentiment",
      value: -0.7,
      timeWindow: 30,
      isActive: true,
      alertLevel: "high",
      description: "Alerte si le sentiment moyen descend sous -0.7 en 30 minutes"
    },
    {
      id: "3",
      name: "Vitesse de propagation rapide",
      type: "velocity",
      value: 200,
      timeWindow: 15,
      isActive: true,
      alertLevel: "critical",
      description: "Alerte critique si plus de 200% d'augmentation en 15 minutes"
    },
    {
      id: "4",
      name: "Mot-clé critique détecté",
      type: "keyword",
      value: 5,
      timeWindow: 5,
      isActive: true,
      alertLevel: "critical",
      description: "Alerte immédiate si un mot-clé critique apparaît 5 fois en 5 minutes"
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    enableAutoAdjustment: true,
    sensibilityLevel: 3,
    minimumConfidence: 0.6,
    enableWeekendMode: false,
    enableNightMode: true
  });

  const handleThresholdChange = (id: string, field: keyof ThresholdConfig, value: any) => {
    setThresholds(prev => prev.map(threshold => 
      threshold.id === id ? { ...threshold, [field]: value } : threshold
    ));
  };

  const handleToggleThreshold = (id: string) => {
    setThresholds(prev => prev.map(threshold => 
      threshold.id === id ? { ...threshold, isActive: !threshold.isActive } : threshold
    ));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les seuils d'alerte ont été mis à jour.",
    });
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "volume":
        return <TrendingUp className="w-4 h-4" />;
      case "sentiment":
        return <Bell className="w-4 h-4" />;
      case "velocity":
        return <Clock className="w-4 h-4" />;
      case "keyword":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Configuration des seuils d'alerte
          </span>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Paramètres globaux */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-4">Paramètres globaux</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Niveau de sensibilité général</Label>
                <div className="px-3">
                  <Slider
                    value={[globalSettings.sensibilityLevel]}
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, sensibilityLevel: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Faible</span>
                    <span>Élevé</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confiance minimale</Label>
                <div className="px-3">
                  <Slider
                    value={[globalSettings.minimumConfidence * 100]}
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, minimumConfidence: value[0] / 100 }))}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-gray-500 mt-1">
                    {Math.round(globalSettings.minimumConfidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={globalSettings.enableAutoAdjustment}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableAutoAdjustment: checked }))}
                />
                <Label>Ajustement automatique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={globalSettings.enableWeekendMode}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableWeekendMode: checked }))}
                />
                <Label>Mode weekend</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={globalSettings.enableNightMode}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableNightMode: checked }))}
                />
                <Label>Mode nuit (22h-6h)</Label>
              </div>
            </div>
          </div>

          {/* Configuration des seuils */}
          <div className="space-y-4">
            <h4 className="font-medium">Seuils d'alerte par type</h4>
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(threshold.type)}
                    <div>
                      <h5 className="font-medium">{threshold.name}</h5>
                      <p className="text-sm text-gray-600">{threshold.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getAlertLevelColor(threshold.alertLevel)}`}>
                      {threshold.alertLevel === "low" ? "Faible" :
                       threshold.alertLevel === "medium" ? "Moyen" :
                       threshold.alertLevel === "high" ? "Élevé" : "Critique"}
                    </div>
                    <Switch
                      checked={threshold.isActive}
                      onCheckedChange={() => handleToggleThreshold(threshold.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`value-${threshold.id}`}>
                      {threshold.type === "volume" ? "Nombre de mentions" :
                       threshold.type === "sentiment" ? "Score de sentiment" :
                       threshold.type === "velocity" ? "Pourcentage d'augmentation" :
                       "Nombre d'occurrences"}
                    </Label>
                    <Input
                      id={`value-${threshold.id}`}
                      type="number"
                      value={threshold.value}
                      onChange={(e) => handleThresholdChange(threshold.id, "value", parseFloat(e.target.value))}
                      step={threshold.type === "sentiment" ? "0.1" : "1"}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`timeWindow-${threshold.id}`}>Fenêtre de temps (minutes)</Label>
                    <Input
                      id={`timeWindow-${threshold.id}`}
                      type="number"
                      value={threshold.timeWindow}
                      onChange={(e) => handleThresholdChange(threshold.id, "timeWindow", parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`alertLevel-${threshold.id}`}>Niveau d'alerte</Label>
                    <select
                      id={`alertLevel-${threshold.id}`}
                      value={threshold.alertLevel}
                      onChange={(e) => handleThresholdChange(threshold.id, "alertLevel", e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                      <option value="critical">Critique</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aperçu des règles actives */}
          <div className="p-4 border rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">Résumé des alertes actives</h4>
            <div className="text-sm text-blue-700">
              <p>• {thresholds.filter(t => t.isActive).length} seuils d'alerte activés sur {thresholds.length}</p>
              <p>• Sensibilité générale: Niveau {globalSettings.sensibilityLevel}/5</p>
              <p>• Confiance minimale: {Math.round(globalSettings.minimumConfidence * 100)}%</p>
              <p>• Mode automatique: {globalSettings.enableAutoAdjustment ? "Activé" : "Désactivé"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
