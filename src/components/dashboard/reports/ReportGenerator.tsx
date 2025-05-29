
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRangePicker } from "./components/DateRangePicker";
import { AdvancedReportOptions } from "./components/AdvancedReportOptions";
import { ReportGenerationProgress } from "./components/ReportGenerationProgress";
import { useReportGenerator } from "./hooks/useReportGenerator";
import { REPORT_TYPES, PERIODS, FORMATS } from "./types/reportTypes";

interface ReportGeneratorProps {
  canGenerateReports: boolean;
}

export const ReportGenerator = ({ canGenerateReports }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState('');
  const [period, setPeriod] = useState('');
  const [format, setFormat] = useState('');
  const [customDateRange, setCustomDateRange] = useState<{startDate: string, endDate: string} | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState<any>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { progress, generateReport, cancelGeneration } = useReportGenerator();
  const { toast } = useToast();

  if (!canGenerateReports) return null;

  const isFormValid = reportType && period && format && 
    (period !== 'custom' || (customDateRange?.startDate && customDateRange?.endDate));

  const handleGenerateReport = async () => {
    if (!isFormValid) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    try {
      const config = {
        type: reportType,
        period,
        format,
        customDateRange: period === 'custom' ? customDateRange : undefined,
        ...advancedOptions
      };

      const report = await generateReport(config);
      
      toast({
        title: "Rapport généré avec succès!",
        description: `Le rapport "${report.title}" est prêt à être téléchargé.`,
      });

      // Reset form
      setReportType('');
      setPeriod('');
      setFormat('');
      setCustomDateRange(null);
      setAdvancedOptions({});
      setShowAdvanced(false);

    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération du rapport.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générer un nouveau rapport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de rapport *</label>
              <Select value={reportType} onValueChange={setReportType} disabled={progress.isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REPORT_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période *</label>
              <Select value={period} onValueChange={setPeriod} disabled={progress.isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERIODS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format *</label>
              <Select value={format} onValueChange={setFormat} disabled={progress.isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FORMATS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {period === 'custom' && (
            <DateRangePicker 
              onDateRangeChange={(startDate, endDate) => setCustomDateRange({startDate, endDate})}
              disabled={progress.isGenerating}
            />
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              disabled={progress.isGenerating}
            >
              {showAdvanced ? 'Masquer' : 'Afficher'} les options avancées
            </Button>

            <Button 
              onClick={handleGenerateReport}
              disabled={!isFormValid || progress.isGenerating}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {progress.isGenerating ? (
                <>Génération en cours...</>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le rapport
                </>
              )}
            </Button>
          </div>

          {showAdvanced && (
            <AdvancedReportOptions 
              onOptionsChange={setAdvancedOptions}
              disabled={progress.isGenerating}
            />
          )}
        </CardContent>
      </Card>

      <ReportGenerationProgress 
        progress={progress}
        onCancel={cancelGeneration}
      />

      {progress.progress === 100 && !progress.isGenerating && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Rapport généré avec succès!</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
