
import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SystemSettings } from "@/types/systemSettings";

interface NotificationSettingsProps {
  settings: SystemSettings;
  onSettingChange: (section: keyof SystemSettings, field: string, value: any) => void;
}

export const NotificationSettings = ({ settings, onSettingChange }: NotificationSettingsProps) => {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-4 flex items-center">
        <Bell className="w-4 h-4 mr-2" />
        Notifications système
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.notifications.emailEnabled}
            onCheckedChange={(checked) => onSettingChange("notifications", "emailEnabled", checked)}
          />
          <Label>Notifications email</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.notifications.smsEnabled}
            onCheckedChange={(checked) => onSettingChange("notifications", "smsEnabled", checked)}
          />
          <Label>Notifications SMS</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.notifications.webhookEnabled}
            onCheckedChange={(checked) => onSettingChange("notifications", "webhookEnabled", checked)}
          />
          <Label>Webhooks</Label>
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="digestFreq">Fréquence des résumés</Label>
        <select
          id="digestFreq"
          value={settings.notifications.digestFrequency}
          onChange={(e) => onSettingChange("notifications", "digestFrequency", e.target.value)}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>
      </div>
    </div>
  );
};
