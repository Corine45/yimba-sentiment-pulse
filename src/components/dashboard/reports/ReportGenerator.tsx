
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

interface ReportGeneratorProps {
  canGenerateReports: boolean;
}

export const ReportGenerator = ({ canGenerateReports }: ReportGeneratorProps) => {
  if (!canGenerateReports) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générer un nouveau rapport</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de rapport</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sentiment">Analyse de sentiment</SelectItem>
                <SelectItem value="demographic">Analyse démographique</SelectItem>
                <SelectItem value="ai">Analyse IA</SelectItem>
                <SelectItem value="crisis">Rapport de crise</SelectItem>
                <SelectItem value="trends">Tendances</SelectItem>
                <SelectItem value="keywords">Fréquence mots-clés</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="3m">3 derniers mois</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="powerpoint">PowerPoint</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <FileText className="w-4 h-4 mr-2" />
          Générer le rapport
        </Button>
      </CardContent>
    </Card>
  );
};
