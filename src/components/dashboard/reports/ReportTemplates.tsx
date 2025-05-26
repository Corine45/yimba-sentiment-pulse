
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReportTemplatesProps {
  canGenerateReports: boolean;
}

export const ReportTemplates = ({ canGenerateReports }: ReportTemplatesProps) => {
  if (!canGenerateReports) return null;

  const templates = [
    { name: "Rapport Exécutif", description: "Vue d'ensemble pour la direction" },
    { name: "Analyse Démographique", description: "Focus sur les données démographiques" },
    { name: "Analyse IA Complète", description: "Rapport avec tous les widgets IA" },
    { name: "Rapport de Crise", description: "Focus sur les alertes et situations critiques" },
    { name: "Tendances & Mots-clés", description: "Analyse des tendances et fréquences" },
    { name: "Rapport Multimédia", description: "Analyse des contenus visuels et vidéos" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modèles de rapports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Utiliser ce modèle
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
