
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, BarChart, Eye, Clock, RefreshCw } from "lucide-react";
import { useDynamicReportsData } from "@/hooks/useDynamicReportsData";
import { useAuth } from "@/hooks/useAuth";
import { getRolePermissions } from "@/components/dashboard/utils/dashboardUtils";

export const DynamicReportsList = () => {
  const { reportsData, loading, refetch } = useDynamicReportsData();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const permissions = getRolePermissions(user.role);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return <Badge className="bg-green-100 text-green-800">Généré</Badge>;
      case "generating":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours...</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ai_analysis":
        return <BarChart className="w-4 h-4 text-purple-600" />;
      case "search_report":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ai_analysis":
        return "Analyse IA";
      case "search_report":
        return "Rapport de recherche";
      default:
        return "Rapport";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rapports disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {permissions.canGenerateReports ? "Rapports récents" : "Rapports disponibles"}
            <Badge variant="outline" className="ml-2">
              {reportsData.length} rapport{reportsData.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reportsData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Aucun rapport disponible.</p>
            <p className="text-sm mt-2">
              {permissions.canGenerateReports ? 
                "Créez vos premiers rapports en effectuant des recherches." :
                "Les rapports apparaîtront ici une fois générés par les analystes."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportsData.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 flex-1">
                  {getTypeIcon(report.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{report.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BarChart className="w-3 h-3" />
                        <span>{getTypeLabel(report.type)}</span>
                      </span>
                      {report.platforms.length > 0 && (
                        <span className="text-xs">
                          Plateformes: {report.platforms.join(', ')}
                        </span>
                      )}
                    </div>
                    
                    {/* Résumé des sentiments */}
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="text-green-600">
                        Positif: {report.sentiment_summary.positive}%
                      </span>
                      <span className="text-red-600">
                        Négatif: {report.sentiment_summary.negative}%
                      </span>
                      <span className="text-gray-600">
                        Neutre: {report.sentiment_summary.neutral}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  
                  {report.status === "generated" && permissions.canExportData && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                  
                  {report.status === "generated" && !permissions.canExportData && (
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Consulter
                    </Button>
                  )}
                  
                  {report.status === "generating" && (
                    <div className="flex items-center text-sm text-yellow-600">
                      <Clock className="w-4 h-4 mr-1" />
                      En cours...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
