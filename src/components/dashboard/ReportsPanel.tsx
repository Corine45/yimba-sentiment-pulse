
import { Eye } from "lucide-react";
import { ReportGenerator } from "./reports/ReportGenerator";
import { WidgetPreviews } from "./reports/WidgetPreviews";
import { ReportTemplates } from "./reports/ReportTemplates";
import { DynamicDemographicAnalysis } from "./widgets/DynamicDemographicAnalysis";
import { DynamicReportsList } from "./widgets/DynamicReportsList";

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

      {/* Analyses démographiques dynamiques */}
      <DynamicDemographicAnalysis />
      
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
