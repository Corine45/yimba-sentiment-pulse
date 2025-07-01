
import { Badge } from "@/components/ui/badge";
import { SystemStats } from "@/types/systemSettings";

interface SystemInfoCardProps {
  stats: SystemStats;
}

export const SystemInfoCard = ({ stats }: SystemInfoCardProps) => {
  return (
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
  );
};
