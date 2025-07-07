
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvancedReportOptions } from "./components/AdvancedReportOptions";
import { ReportGenerationProgress } from "./components/ReportGenerationProgress";
import { ReportFormFields } from "./components/ReportFormFields";
import { ReportFormatSelector } from "./components/ReportFormatSelector";
import { GeneratedReportsList } from "./components/GeneratedReportsList";
import { useReportGenerator } from "./hooks/useReportGenerator";
import { FORMATS } from "./types/reportTypes";

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

  const { progress, generatedReports, generateReport, cancelGeneration, downloadReport } = useReportGenerator();
  const { toast } = useToast();

  if (!canGenerateReports) return null;

  const isFormValid = reportType && period && format && 
    (period !== 'custom' || (customDateRange?.startDate && customDateRange?.endDate));

  const getFormatIcon = (formatKey: string) => {
    switch (formatKey) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'powerpoint': return <FileText className="w-4 h-4" />;
      case 'html': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

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
        title: 'Rapport Exécutif',
        ...advancedOptions
      };

      const report = await generateReport(config);
      
      toast({
        title: "Rapport généré avec succès!",
        description: `Le rapport "${report.title}" au format ${FORMATS[format as keyof typeof FORMATS]} est prêt.`,
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
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Générer un nouveau rapport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReportFormFields
            reportType={reportType}
            period={period}
            customDateRange={customDateRange}
            onReportTypeChange={setReportType}
            onPeriodChange={setPeriod}
            onDateRangeChange={(startDate, endDate) => setCustomDateRange({startDate, endDate})}
            disabled={progress.isGenerating}
          />

          <ReportFormatSelector
            format={format}
            onFormatChange={setFormat}
            disabled={progress.isGenerating}
          />

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
                  {format && getFormatIcon(format)}
                  <span className="ml-2">Générer le rapport</span>
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

      <GeneratedReportsList
        reports={generatedReports}
        onDownload={downloadReport}
      />
    </div>
  );
};
