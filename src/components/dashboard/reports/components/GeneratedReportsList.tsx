
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Clock, FileText, Monitor, FileImage } from "lucide-react";
import { GeneratedReport, FORMATS } from "../types/reportTypes";

interface GeneratedReportsListProps {
  reports: GeneratedReport[];
  onDownload: (report: GeneratedReport) => void;
}

export const GeneratedReportsList = ({
  reports,
  onDownload
}: GeneratedReportsListProps) => {
  const getFormatIcon = (formatKey: string) => {
    switch (formatKey) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'powerpoint': return <Monitor className="w-4 h-4" />;
      case 'html': return <FileImage className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Rapports générés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">{report.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-green-700">
                    <span className="flex items-center gap-1">
                      {getFormatIcon(report.format)}
                      {FORMATS[report.format as keyof typeof FORMATS]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(report.generatedAt).toLocaleString('fr-FR')}
                    </span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => onDownload(report)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
