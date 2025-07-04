
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Download, FileSpreadsheet, File } from "lucide-react";

interface ExportFormatSelectorProps {
  onExport: (format: 'json' | 'pdf' | 'csv') => void;
  isExporting: boolean;
  mentionsCount: number;
}

export const ExportFormatSelector = ({ onExport, isExporting, mentionsCount }: ExportFormatSelectorProps) => {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'pdf' | 'csv'>('json');

  const formats = [
    {
      id: 'json' as const,
      name: 'JSON',
      icon: File,
      description: 'Données brutes complètes',
      features: ['Métadonnées complètes', 'Structure hiérarchique', 'Compatible APIs'],
      size: 'Détaillé',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 'pdf' as const,
      name: 'PDF',
      icon: FileText,
      description: 'Rapport visuel formaté',
      features: ['Graphiques', 'Mise en page', 'Prêt à partager'],
      size: 'Compact',
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    {
      id: 'csv' as const,
      name: 'CSV',
      icon: FileSpreadsheet,
      description: 'Tableau de données',
      features: ['Compatible Excel', 'Analyse avancée', 'Filtrage facile'],
      size: 'Structuré',
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Exporter les résultats</span>
          <Badge variant="secondary">{mentionsCount} mentions</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedFormat}
          onValueChange={(value) => setSelectedFormat(value as 'json' | 'pdf' | 'csv')}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {formats.map((format) => (
            <div key={format.id} className="relative">
              <RadioGroupItem
                value={format.id}
                id={format.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={format.id}
                className={`
                  flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                  peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:border-blue-500
                  hover:border-gray-300 ${format.color}
                `}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <format.icon className="w-6 h-6" />
                  <div>
                    <div className="font-semibold text-lg">{format.name}</div>
                    <div className="text-sm opacity-70">{format.description}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium">Caractéristiques :</div>
                  <ul className="text-xs space-y-1">
                    {format.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Badge variant="outline" className="self-start mt-2">
                  {format.size}
                </Badge>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            <strong>Format sélectionné :</strong> {formats.find(f => f.id === selectedFormat)?.name}
          </div>
          <div className="text-xs text-gray-500">
            {formats.find(f => f.id === selectedFormat)?.description}
          </div>
        </div>

        <Button
          onClick={() => onExport(selectedFormat)}
          disabled={isExporting || mentionsCount === 0}
          className="w-full"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Export en cours...' : `Exporter en ${selectedFormat.toUpperCase()}`}
        </Button>

        {mentionsCount === 0 && (
          <div className="text-center text-sm text-gray-500">
            Aucune mention à exporter. Lancez d'abord une recherche.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
