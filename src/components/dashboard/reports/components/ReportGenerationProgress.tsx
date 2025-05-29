
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, X, Clock } from "lucide-react";
import { ReportGenerationProgress as ProgressType } from "../types/reportTypes";

interface ReportGenerationProgressProps {
  progress: ProgressType;
  onCancel: () => void;
}

export const ReportGenerationProgress = ({ progress, onCancel }: ReportGenerationProgressProps) => {
  if (!progress.isGenerating) return null;

  return (
    <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
            Génération en cours...
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{progress.currentStep}</span>
            <span className="font-medium text-blue-600">{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>
        
        {progress.estimatedTime && progress.progress < 100 && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            Temps estimé restant : {Math.round((progress.estimatedTime * (100 - progress.progress)) / 100)}s
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Le rapport sera automatiquement téléchargé une fois terminé.
        </div>
      </CardContent>
    </Card>
  );
};
