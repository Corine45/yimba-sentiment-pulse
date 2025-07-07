
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BarChart, Eye } from "lucide-react";

interface Report {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
}

interface ReportsListProps {
  canGenerateReports: boolean;
  canExportData: boolean;
}

export const ReportsList = ({ canGenerateReports, canExportData }: ReportsListProps) => {
  const reports: Report[] = [
    {
      id: 1,
      title: "Rapport Sentiment Hebdomadaire",
      description: "Analyse des sentiments pour la semaine du 20-26 Mai 2024",
      date: "26 Mai 2024",
      type: "sentiment",
      status: "generated"
    },
    {
      id: 2,
      title: "Analyse de Crise - Secteur Éducation",
      description: "Rapport détaillé sur les mentions négatives dans l'éducation",
      date: "25 Mai 2024",
      type: "crisis",
      status: "generated"
    },
    {
      id: 3,
      title: "Tendances Mensuelles - Mai 2024",
      description: "Vue d'ensemble des tendances et sujets émergents",
      date: "24 Mai 2024",
      type: "trends",
      status: "generating"
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === "generated") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Généré</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En cours...</span>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sentiment":
        return <BarChart className="w-4 h-4 text-blue-600" />;
      case "crisis":
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {canGenerateReports ? "Rapports récents" : "Rapports disponibles"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                {getTypeIcon(report.type)}
                <div>
                  <h4 className="font-medium">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{report.date}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusBadge(report.status)}
                {report.status === "generated" && canExportData && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                )}
                {report.status === "generated" && !canExportData && (
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Consulter
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
