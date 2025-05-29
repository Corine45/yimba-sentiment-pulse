
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TemplateCard } from "./components/TemplateCard";
import { useReportTemplates } from "./hooks/useReportTemplates";
import { useReportGenerator } from "./hooks/useReportGenerator";
import { TEMPLATE_CATEGORIES } from "./types/templateTypes";

interface ReportTemplatesProps {
  canGenerateReports: boolean;
}

export const ReportTemplates = ({ canGenerateReports }: ReportTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { templates, useTemplate } = useReportTemplates();
  const { generateReport, progress } = useReportGenerator();
  const { toast } = useToast();

  if (!canGenerateReports) return null;

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleUseTemplate = async (template: any) => {
    try {
      const config = useTemplate(template);
      
      toast({
        title: "Modèle sélectionné",
        description: `Configuration du modèle "${template.name}" appliquée.`,
      });

      // Générer automatiquement le rapport avec la configuration du modèle
      await generateReport({
        ...config,
        title: template.name,
        description: `Rapport généré à partir du modèle: ${template.name}`
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'utiliser ce modèle pour le moment.",
        variant: "destructive"
      });
    }
  };

  const resetFilter = () => {
    setSelectedCategory('all');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            Modèles de rapports
            <Badge variant="outline" className="ml-2">
              {filteredTemplates.length} modèle{filteredTemplates.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCategory !== 'all' && (
              <Button variant="outline" size="sm" onClick={resetFilter}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun modèle trouvé pour cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
                disabled={progress.isGenerating}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
