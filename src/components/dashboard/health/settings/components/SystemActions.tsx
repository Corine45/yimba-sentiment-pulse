
import { Button } from "@/components/ui/button";
import { Download, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SystemSettings } from "@/types/systemSettings";

interface SystemActionsProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export const SystemActions = ({ settings, onSaveSettings }: SystemActionsProps) => {
  const { toast } = useToast();

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
        onSaveSettings(importedSettings);
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

    onSaveSettings(defaultSettings);
    toast({
      title: "Paramètres réinitialisés",
      description: "La configuration par défaut a été restaurée.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
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
  );
};
