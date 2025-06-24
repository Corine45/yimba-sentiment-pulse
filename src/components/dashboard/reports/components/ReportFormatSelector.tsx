
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Monitor, FileImage } from "lucide-react";
import { FORMATS } from "../types/reportTypes";

interface ReportFormatSelectorProps {
  format: string;
  onFormatChange: (value: string) => void;
  disabled: boolean;
}

export const ReportFormatSelector = ({
  format,
  onFormatChange,
  disabled
}: ReportFormatSelectorProps) => {
  const getFormatIcon = (formatKey: string) => {
    switch (formatKey) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'powerpoint': return <Monitor className="w-4 h-4" />;
      case 'html': return <FileImage className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (formatKey: string) => {
    switch (formatKey) {
      case 'pdf': return 'Document optimisé pour impression et archivage';
      case 'powerpoint': return 'Présentation interactive avec slides animées';
      case 'html': return 'Rapport web interactif avec graphiques dynamiques';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Format de sortie *</label>
        <Select value={format} onValueChange={onFormatChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir le format..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FORMATS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  {getFormatIcon(key)}
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {format && (
          <p className="text-xs text-muted-foreground mt-1">
            {getFormatDescription(format)}
          </p>
        )}
      </div>

      {format && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            {getFormatIcon(format)}
            <div>
              <h4 className="font-medium text-blue-900">
                Format sélectionné: {FORMATS[format as keyof typeof FORMATS]}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                {getFormatDescription(format)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
