
import { RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemStats } from "@/types/systemSettings";

interface SystemStatsCardProps {
  stats: SystemStats;
  onRefresh: () => void;
  onSimulateMetrics: () => void;
}

export const SystemStatsCard = ({ stats, onRefresh, onSimulateMetrics }: SystemStatsCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Statistiques système</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={onSimulateMetrics}>
            <Database className="w-4 h-4 mr-2" />
            Simuler métriques
          </Button>
        </div>
      </div>
      
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
    </div>
  );
};
