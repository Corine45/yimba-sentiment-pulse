
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SystemSettings } from "@/types/systemSettings";

interface PerformanceSettingsProps {
  settings: SystemSettings;
  onSettingChange: (section: keyof SystemSettings, field: string, value: any) => void;
}

export const PerformanceSettings = ({ settings, onSettingChange }: PerformanceSettingsProps) => {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-4">Optimisation des performances</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cacheExpiry">Expiration du cache (minutes)</Label>
          <Input
            id="cacheExpiry"
            type="number"
            value={settings.performance.cacheExpiry}
            onChange={(e) => onSettingChange("performance", "cacheExpiry", parseInt(e.target.value))}
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
            onChange={(e) => onSettingChange("performance", "maxMemoryUsage", parseInt(e.target.value))}
            min="50"
            max="95"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.performance.enableCaching}
            onCheckedChange={(checked) => onSettingChange("performance", "enableCaching", checked)}
          />
          <Label>Cache activé</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.performance.enableCompression}
            onCheckedChange={(checked) => onSettingChange("performance", "enableCompression", checked)}
          />
          <Label>Compression HTTP</Label>
        </div>
      </div>
    </div>
  );
};
