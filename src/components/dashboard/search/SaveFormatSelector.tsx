
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Download, FileSpreadsheet, File, Save } from "lucide-react";

interface SaveFormatSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fileName: string, format: 'json' | 'pdf' | 'csv') => void;
  isSaving?: boolean;
  mentionsCount: number;
}

export const SaveFormatSelector = ({
  open,
  onOpenChange,
  onSave,
  isSaving = false,
  mentionsCount
}: SaveFormatSelectorProps) => {
  const [fileName, setFileName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'pdf' | 'csv'>('json');

  const formats = [
    {
      id: 'json' as const,
      name: 'JSON',
      icon: File,
      description: 'Données complètes avec métadonnées',
      features: ['Structure hiérarchique', 'Métadonnées complètes', 'Compatible APIs'],
      color: 'text-blue-600'
    },
    {
      id: 'pdf' as const,
      name: 'PDF',
      icon: FileText,
      description: 'Rapport visuel formaté',
      features: ['Mise en page professionnelle', 'Graphiques intégrés', 'Prêt à partager'],
      color: 'text-red-600'
    },
    {
      id: 'csv' as const,
      name: 'CSV',
      icon: FileSpreadsheet,
      description: 'Données tabulaires',
      features: ['Compatible Excel', 'Analyse avancée', 'Import/Export facile'],
      color: 'text-green-600'
    }
  ];

  const handleSave = () => {
    if (!fileName.trim()) return;
    onSave(fileName.trim(), selectedFormat);
  };

  const generateFileName = () => {
    const date = new Date().toISOString().slice(0, 10);
    const defaultName = `mentions_${date}_${mentionsCount}`;
    setFileName(defaultName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-blue-600" />
            <span>Sauvegarder les mentions</span>
          </DialogTitle>
          <DialogDescription>
            Choisissez le format et donnez un nom à votre sauvegarde ({mentionsCount} mentions)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nom du fichier */}
          <div className="space-y-2">
            <Label htmlFor="fileName">Nom du fichier</Label>
            <div className="flex space-x-2">
              <Input
                id="fileName"
                placeholder="Ex: mentions_janvier_2024"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateFileName}
                type="button"
              >
                Auto
              </Button>
            </div>
          </div>

          {/* Sélection du format */}
          <div className="space-y-3">
            <Label>Format d'export</Label>
            <RadioGroup
              value={selectedFormat}
              onValueChange={(value) => setSelectedFormat(value as 'json' | 'pdf' | 'csv')}
              className="space-y-3"
            >
              {formats.map((format) => (
                <div key={format.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={format.id} id={format.id} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={format.id} 
                      className={`flex items-center space-x-2 cursor-pointer ${format.color}`}
                    >
                      <format.icon className="w-4 h-4" />
                      <span className="font-medium">{format.name}</span>
                    </Label>
                    <p className="text-sm text-gray-600">{format.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {format.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Aperçu */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-blue-900">Aperçu:</div>
              <div className="text-blue-700 mt-1">
                📁 {fileName || 'nom_du_fichier'}.{selectedFormat}
              </div>
              <div className="text-blue-600 text-xs mt-1">
                {formats.find(f => f.id === selectedFormat)?.description}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!fileName.trim() || isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Sauvegarder en {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
