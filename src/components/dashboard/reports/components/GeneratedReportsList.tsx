
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Clock, FileText, Monitor, FileImage, Eye, Share2, Trash2 } from "lucide-react";
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

  const handlePreview = (report: GeneratedReport) => {
    if (report.fileUrl && report.fileUrl !== '#') {
      window.open(report.fileUrl, '_blank');
    }
  };

  const handleShare = (report: GeneratedReport) => {
    if (navigator.share && report.fileUrl && report.fileUrl !== '#') {
      navigator.share({
        title: report.title,
        text: `Rapport généré: ${report.title}`,
        url: report.fileUrl
      });
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(report.fileUrl || '');
    }
  };

  const handleDelete = (reportId: string) => {
    // Cette fonctionnalité pourrait être implémentée plus tard
    console.log('Supprimer le rapport:', reportId);
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Rapports générés ({reports.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border rounded-lg bg-green-50 border-green-300 overflow-hidden">
              {/* En-tête du rapport */}
              <div className="flex items-center justify-between p-4 bg-green-100 border-b border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">{report.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-green-700 mt-1">
                      <span className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        {FORMATS[report.format as keyof typeof FORMATS]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.generatedAt).toLocaleString('fr-FR')}
                      </span>
                      <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Bouton Aperçu */}
                  <Button 
                    onClick={() => handlePreview(report)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {/* Bouton Partager */}
                  <Button 
                    onClick={() => handleShare(report)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Corps du rapport avec options de téléchargement */}
              <div className="p-4 space-y-3">
                {/* Informations détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                  <div>
                    <span className="font-medium">Type:</span> {report.type}
                  </div>
                  <div>
                    <span className="font-medium">Statut:</span> 
                    <span className="ml-1 px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                      Terminé
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {report.id.slice(-8)}
                  </div>
                </div>

                {/* Options de téléchargement développées */}
                <div className="border-t border-green-200 pt-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="text-sm text-green-700">
                      <span className="font-medium">Options de téléchargement:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Téléchargement principal */}
                      <Button 
                        onClick={() => onDownload(report)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger {FORMATS[report.format as keyof typeof FORMATS]}
                      </Button>
                      
                      {/* Téléchargement rapide */}
                      <Button 
                        onClick={() => onDownload(report)}
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Rapide
                      </Button>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-600 space-y-1">
                      <div>• Le rapport sera téléchargé dans votre dossier de téléchargements par défaut</div>
                      <div>• Format de fichier: .{report.format === 'powerpoint' ? 'html' : report.format === 'pdf' ? 'html' : 'html'}</div>
                      <div>• Compatible avec tous les navigateurs modernes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
