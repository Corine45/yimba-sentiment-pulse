
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, ExternalLink, Download, Users } from "lucide-react";
import { TrainingResource } from "../types/trainingTypes";

interface ResourcesListProps {
  resources: TrainingResource[];
}

export const ResourcesList = ({ resources }: ResourcesListProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-5 h-5 text-red-600" />;
      case "video": return <Video className="w-5 h-5 text-blue-600" />;
      case "external_link": return <ExternalLink className="w-5 h-5 text-green-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "pdf": return "Document PDF";
      case "video": return "Vidéo";
      case "interactive": return "Module interactif";
      case "external_link": return "Lien externe";
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ressources complémentaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div 
              key={resource.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getTypeIcon(resource.type)}
                <div>
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge variant="outline">{resource.category}</Badge>
                    <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{resource.downloadCount} téléchargements</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  Mis à jour: {new Date(resource.lastUpdated).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  {resource.type === "external_link" ? (
                    <>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Consulter
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
