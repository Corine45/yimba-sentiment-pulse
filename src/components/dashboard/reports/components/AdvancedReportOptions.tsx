
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

interface AdvancedReportOptionsProps {
  onOptionsChange: (options: {
    title?: string;
    description?: string;
    includeCharts: boolean;
    includeRawData: boolean;
    includeExecutiveSummary: boolean;
  }) => void;
  disabled?: boolean;
}

export const AdvancedReportOptions = ({ onOptionsChange, disabled }: AdvancedReportOptionsProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState(true);

  const handleChange = () => {
    onOptionsChange({
      title: title || undefined,
      description: description || undefined,
      includeCharts,
      includeRawData,
      includeExecutiveSummary
    });
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Options avancées (optionnel)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportTitle" className="text-sm font-medium">
            Titre personnalisé
          </Label>
          <Input
            id="reportTitle"
            placeholder="Laissez vide pour un titre automatique"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTimeout(handleChange, 0);
            }}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportDescription" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="reportDescription"
            placeholder="Description ou contexte du rapport..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setTimeout(handleChange, 0);
            }}
            disabled={disabled}
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Contenu à inclure</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={includeCharts}
                onCheckedChange={(checked) => {
                  setIncludeCharts(checked as boolean);
                  setTimeout(handleChange, 0);
                }}
                disabled={disabled}
              />
              <Label htmlFor="includeCharts" className="text-sm">
                Graphiques et visualisations
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeExecutiveSummary"
                checked={includeExecutiveSummary}
                onCheckedChange={(checked) => {
                  setIncludeExecutiveSummary(checked as boolean);
                  setTimeout(handleChange, 0);
                }}
                disabled={disabled}
              />
              <Label htmlFor="includeExecutiveSummary" className="text-sm">
                Résumé exécutif
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeRawData"
                checked={includeRawData}
                onCheckedChange={(checked) => {
                  setIncludeRawData(checked as boolean);
                  setTimeout(handleChange, 0);
                }}
                disabled={disabled}
              />
              <Label htmlFor="includeRawData" className="text-sm">
                Données brutes (annexe)
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
