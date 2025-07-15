import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, FileText, Download, Sparkles } from "lucide-react";
import { format as formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import { useReportGenerator } from "./hooks/useReportGenerator";
import { ReportGenerationProgress } from "./components/ReportGenerationProgress";
import { YimbaReportTemplate } from "./templates/YimbaReportTemplate";
import { toast } from "sonner";

export const YimbaReportGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [format, setFormat] = useState("html");
  const [showPreview, setShowPreview] = useState(false);

  const { generateYimbaReport, progress, generatedReports } = useReportGenerator();

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleGenerateReport = async () => {
    if (!searchTerm) {
      toast.error("Veuillez saisir un sujet de recherche");
      return;
    }

    const config = {
      title: searchTerm,
      type: 'yimba-analysis',
      period: '7d',
      format,
      dateRange,
      keywords: keywords.length > 0 ? keywords : [searchTerm]
    };

    try {
      await generateYimbaReport(config);
      toast.success("Rapport Yimba généré avec succès!");
    } catch (error) {
      toast.error("Erreur lors de la génération du rapport");
    }
  };

  const handlePreview = () => {
    if (!searchTerm) {
      toast.error("Veuillez saisir un sujet de recherche pour prévisualiser");
      return;
    }
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Prévisualisation du Rapport Yimba</h2>
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            Retour à l'éditeur
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-auto max-h-[80vh]">
          <YimbaReportTemplate
            searchTerm={searchTerm}
            keywords={keywords.length > 0 ? keywords : [searchTerm]}
            dateRange={dateRange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Générateur de Rapport Yimba</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sujet de recherche */}
          <div className="space-y-2">
            <Label htmlFor="searchTerm">Sujet de recherche principal</Label>
            <Input
              id="searchTerm"
              placeholder="Ex: Campagne anti woubi, COVID-19, Éducation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Mots-clés */}
          <div className="space-y-2">
            <Label>Mots-clés additionnels</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Ajouter un mot-clé"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button onClick={handleAddKeyword} variant="outline">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm cursor-pointer"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  {keyword} ×
                </span>
              ))}
            </div>
          </div>

          {/* Période */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(dateRange.from, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(dateRange.to, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label>Format de sortie</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML (Prévisualisation)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="powerpoint">PowerPoint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button onClick={handlePreview} variant="outline" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Prévisualiser
            </Button>
            <Button 
              onClick={handleGenerateReport} 
              className="flex-1"
              disabled={progress.isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              Générer le rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progression */}
      {progress.isGenerating && (
        <ReportGenerationProgress
          progress={progress}
          onCancel={() => {}}
        />
      )}

      {/* Rapports générés */}
      {generatedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rapports générés récemment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-500">
                      {report.format.toUpperCase()} • {report.size}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};