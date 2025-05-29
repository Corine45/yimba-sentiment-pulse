
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface HealthCaseTrackingProps {
  userRole: string;
  permissions: any;
}

export const HealthCaseTracking = ({ userRole, permissions }: HealthCaseTrackingProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Suivi des cas et interventions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Module en développement</h3>
          <p className="text-gray-600 mb-4">
            Le système de suivi post-alerte sera disponible prochainement.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✓ Fiches de suivi par intervention</p>
            <p>✓ État des lieux et actions entreprises</p>
            <p>✓ Assignation aux responsables locaux</p>
            <p>✓ Historique des interventions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
