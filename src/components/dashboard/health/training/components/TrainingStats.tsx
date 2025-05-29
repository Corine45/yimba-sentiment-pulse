
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { TrainingStats as TrainingStatsType } from "../types/trainingTypes";

interface TrainingStatsProps {
  stats: TrainingStatsType;
}

export const TrainingStats = ({ stats }: TrainingStatsProps) => {
  const completionRate = stats.totalModules > 0 ? (stats.completedModules / stats.totalModules) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Modules terminés</p>
              <p className="text-xl font-bold">{stats.completedModules}/{stats.totalModules}</p>
            </div>
          </div>
          <Progress value={completionRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Temps de formation</p>
              <p className="text-xl font-bold">{stats.completedHours}h/{stats.totalHours}h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Certificats obtenus</p>
              <p className="text-xl font-bold">{stats.certificatesEarned}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-xl font-bold">{stats.inProgressModules}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
