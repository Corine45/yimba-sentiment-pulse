
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Award, Play, RefreshCw, CheckCircle } from "lucide-react";
import { TrainingModule } from "../types/trainingTypes";

interface TrainingModuleCardProps {
  module: TrainingModule;
  onStart: (moduleId: string) => void;
  onContinue: (moduleId: string) => void;
}

export const TrainingModuleCard = ({ module, onStart, onContinue }: TrainingModuleCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "surveillance": return "border-l-blue-500";
      case "analysis": return "border-l-green-500";
      case "crisis": return "border-l-red-500";
      case "platform": return "border-l-purple-500";
      case "methodology": return "border-l-yellow-500";
      default: return "border-l-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (module.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default:
        return <Play className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionButton = () => {
    switch (module.status) {
      case "completed":
        return (
          <Button variant="outline" size="sm" onClick={() => onContinue(module.id)}>
            Réviser
          </Button>
        );
      case "in_progress":
        return (
          <Button size="sm" onClick={() => onContinue(module.id)}>
            Continuer
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={() => onStart(module.id)}>
            Démarrer
          </Button>
        );
    }
  };

  return (
    <Card className={`border-l-4 ${getCategoryColor(module.category)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h4 className="font-medium text-gray-900">{module.title}</h4>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getLevelColor(module.level)}>
              {module.level}
            </Badge>
            {module.certificateAvailable && (
              <Award className="w-4 h-4 text-yellow-500" title="Certificat disponible" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{module.description}</p>

        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{module.duration} min</span>
          </div>
          {module.lastAccessed && (
            <span>Dernier accès: {new Date(module.lastAccessed).toLocaleDateString()}</span>
          )}
        </div>

        {module.status !== "not_started" && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progression</span>
              <span>{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          {getActionButton()}
          {module.status === "completed" && module.certificateAvailable && (
            <Button variant="outline" size="sm" className="text-yellow-600">
              <Award className="w-4 h-4 mr-1" />
              Certificat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
