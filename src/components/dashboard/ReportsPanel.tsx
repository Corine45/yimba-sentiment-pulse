
import { Eye } from "lucide-react";
import { ReportGenerator } from "./reports/ReportGenerator";
import { WidgetPreviews } from "./reports/WidgetPreviews";
import { ReportTemplates } from "./reports/ReportTemplates";
import { DynamicReportsList } from "./widgets/DynamicReportsList";
import { SentimentOverview } from "./widgets/SentimentOverview";
import { SentimentCharts } from "./widgets/SentimentCharts";
import { TrendingTopics } from "./widgets/TrendingTopics";
import { SourceDiversity } from "./widgets/SourceDiversity";
import { DynamicInfluencerAnalysis } from "./widgets/DynamicInfluencerAnalysis";
import { GeographicDistribution } from "./widgets/GeographicDistribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText } from "lucide-react";

interface ReportsPanelProps {
  userRole: string;
  permissions: {
    canGenerateReports: boolean;
    canExportData: boolean;
  };
}

export const ReportsPanel = ({ userRole, permissions }: ReportsPanelProps) => {
  return (
    <div className="space-y-6">
      {userRole === "observateur" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Eye className="w-4 h-4 inline mr-1" />
            Mode consultation - Vous consultez les rapports en lecture seule
          </p>
        </div>
      )}

      {/* En-tête expliquant la relation avec les analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Rapports basés sur vos analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Cette page présente les rapports générés à partir des données collectées dans la section "Analyses". 
            Les visualisations ci-dessous reflètent les résultats de vos recherches et analyses de sentiment.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <BarChart3 className="w-4 h-4" />
            <span>Données synchronisées avec la page Analyses</span>
          </div>
        </CardContent>
      </Card>

      {/* Widgets d'analyse provenant de la page Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentOverview />
        <SourceDiversity />
      </div>

      <SentimentCharts />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingTopics />
        <DynamicInfluencerAnalysis />
      </div>

      <GeographicDistribution />
      
      {/* Liste des rapports dynamique */}
      <DynamicReportsList />

      {/* Outils de génération de rapports pour les utilisateurs autorisés */}
      {permissions.canGenerateReports && (
        <>
          <ReportGenerator canGenerateReports={permissions.canGenerateReports} />
          <WidgetPreviews canGenerateReports={permissions.canGenerateReports} />
          <ReportTemplates canGenerateReports={permissions.canGenerateReports} />
        </>
      )}
    </div>
  );
};
