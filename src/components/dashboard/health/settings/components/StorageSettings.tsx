
import { Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SystemSettings } from "@/types/systemSettings";

interface StorageSettingsProps {
  settings: SystemSettings;
  onSettingChange: (section: keyof SystemSettings, field: string, value: any) => void;
}

export const StorageSettings = ({ settings, onSettingChange }: StorageSettingsProps) => {
  return (
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
            onChange={(e) => onSettingChange("storage", "retentionPeriod", parseInt(e.target.value))}
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
            onChange={(e) => onSettingChange("storage", "maxStorageSize", parseInt(e.target.value))}
            min="10"
            max="1000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.storage.autoArchive}
            onCheckedChange={(checked) => onSettingChange("storage", "autoArchive", checked)}
          />
          <Label>Archivage automatique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.storage.compressionEnabled}
            onCheckedChange={(checked) => onSettingChange("storage", "compressionEnabled", checked)}
          />
          <Label>Compression des données</Label>
        </div>
      </div>
    </div>
  );
};
