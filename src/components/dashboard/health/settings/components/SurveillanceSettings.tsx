
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemSettings } from "@/types/systemSettings";

interface SurveillanceSettingsProps {
  settings: SystemSettings;
  onSettingChange: (section: keyof SystemSettings, field: string, value: any) => void;
}

export const SurveillanceSettings = ({ settings, onSettingChange }: SurveillanceSettingsProps) => {
  return (
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
            onChange={(e) => onSettingChange("surveillance", "frequency", parseInt(e.target.value))}
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
            onChange={(e) => onSettingChange("surveillance", "maxConcurrentJobs", parseInt(e.target.value))}
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
            onChange={(e) => onSettingChange("surveillance", "retryAttempts", parseInt(e.target.value))}
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
            onChange={(e) => onSettingChange("surveillance", "timeout", parseInt(e.target.value))}
            min="5"
            max="300"
          />
        </div>
      </div>
    </div>
  );
};
