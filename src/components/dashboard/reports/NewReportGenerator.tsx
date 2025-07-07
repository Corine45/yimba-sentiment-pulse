import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, Heart, MessageSquare, Users, MapPin, Settings, Calendar as CalendarIcon, FileText, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useReportGenerator } from "./hooks/useReportGenerator";
import { ReportGenerationProgress } from "./components/ReportGenerationProgress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const NewReportGenerator = () => {
  const [selectedType, setSelectedType] = useState("");
  const [reportConfig, setReportConfig] = useState({
    title: "",
    description: "",
    period: "7d",
    format: "pdf",
    includeRealData: true,
    includeAIContext: true,
    includeDemographics: false,
    includeInfluencers: false,
    includeGeography: false,
    customKeywords: "",
    platforms: [] as string[],
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined
    }
  });

  const {
    progress,
    isGenerating,
    generateReport,
    cancelGeneration,
    generatedReports
  } = useReportGenerator();

  const reportTypes = [
    {
      value: "mentions",
      label: "📊 Rapport de Mentions",
      description: "Analyse complète des mentions sur toutes vos plateformes",
      icon: BarChart,
      features: ["Volume des mentions", "Tendances temporelles", "Sources de données", "Mots-clés populaires"],
      color: "blue"
    },
    {
      value: "sentiment",
      label: "😊 Analyse de Sentiment",
      description: "Sentiment positif, négatif et neutre des conversations",
      icon: Heart,
      features: ["Répartition des sentiments", "Évolution dans le temps", "Mentions par sentiment", "Analyse contextuelle"],
      color: "green"
    },
    {
      value: "engagement",
      label: "❤️ Rapport d'Engagement",
      description: "Likes, partages, commentaires et interactions",
      icon: MessageSquare,
      features: ["Métriques d'engagement", "Taux d'interaction", "Posts les plus engageants", "Analyse par plateforme"],
      color: "red"
    },
    {
      value: "demographic",
      label: "👥 Rapport Démographique",
      description: "Âge, genre et profils des utilisateurs",
      icon: Users,
      features: ["Répartition par âge", "Analyse de genre", "Profils types", "Segmentation audience"],
      color: "purple"
    },
    {
      value: "geographic",
      label: "🌍 Rapport Géographique",
      description: "Répartition par pays, régions et villes",
      icon: MapPin,
      features: ["Carte des mentions", "Top pays/villes", "Analyse régionale", "Données géolocalisées"],
      color: "emerald"
    },
    {
      value: "custom",
      label: "🔄 Rapport Personnalisé",
      description: "Créer un rapport avec vos propres critères",
      icon: Settings,
      features: ["Critères personnalisés", "Filtres avancés", "Métriques sur mesure", "Export flexible"],
      color: "orange"
    }
  ];

  const periods = [
    { value: "24h", label: "Dernières 24h" },
    { value: "7d", label: "7 derniers jours" },
    { value: "30d", label: "30 derniers jours" },
    { value: "90d", label: "3 derniers mois" },
    { value: "custom", label: "Période personnalisée" }
  ];

  const formats = [
    { value: "pdf", label: "PDF", description: "Document imprimable" },
    { value: "html", label: "HTML", description: "Page web interactive" },
    { value: "excel", label: "Excel", description: "Tableur avec données" }
  ];

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter/X" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "linkedin", label: "LinkedIn" }
  ];

  const selectedReportType = reportTypes.find(type => type.value === selectedType);

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }));
  };

  const generateCustomReport = async () => {
    if (!selectedType) {
      toast.error("Veuillez sélectionner un type de rapport");
      return;
    }

    if (!reportConfig.title) {
      toast.error("Veuillez saisir un titre pour le rapport");
      return;
    }

    try {
      const config = {
        title: reportConfig.title,
        description: reportConfig.description,
        type: selectedType,
        period: reportConfig.period,
        format: reportConfig.format,
        includeRealData: reportConfig.includeRealData,
        includeAIContext: reportConfig.includeAIContext,
        includeDemographics: reportConfig.includeDemographics,
        includeInfluencers: reportConfig.includeInfluencers,
        includeGeography: reportConfig.includeGeography,
        customDateRange: reportConfig.period === 'custom' ? {
          startDate: reportConfig.dateRange.from?.toISOString() || '',
          endDate: reportConfig.dateRange.to?.toISOString() || ''
        } : undefined
      };

      await generateReport(config);
      
      // Reset form
      setSelectedType("");
      setReportConfig({
        title: "",
        description: "",
        period: "7d",
        format: "pdf",
        includeRealData: true,
        includeAIContext: true,
        includeDemographics: false,
        includeInfluencers: false,
        includeGeography: false,
        customKeywords: "",
        platforms: [],
        dateRange: { from: undefined, to: undefined }
      });

      toast.success("Rapport généré avec succès !");
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      toast.error("Erreur lors de la génération du rapport");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>✨ Générer un nouveau rapport</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Créez des rapports personnalisés avec vos données en temps réel
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du type de rapport */}
          <div className="space-y-4">
            <Label className="text-base font-medium">1. Choisissez le type de rapport</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                
                return (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-6 h-6 text-${type.color}-600 mt-1`} />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{type.label}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                          <div className="mt-3 space-y-1">
                            {type.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-muted-foreground">
                                <div className="w-1 h-1 bg-current rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {selectedType && (
            <>
              {/* Configuration du rapport */}
              <div className="space-y-4 border-t pt-6">
                <Label className="text-base font-medium">2. Configurez votre rapport</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du rapport *</Label>
                    <Input
                      id="title"
                      value={reportConfig.title}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={`Ex: ${selectedReportType?.label} - ${format(new Date(), 'MMMM yyyy', { locale: fr })}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Format de sortie</Label>
                    <Select value={reportConfig.format} onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map(format => (
                          <SelectItem key={format.value} value={format.value}>
                            <div>
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs text-muted-foreground">{format.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez l'objectif de ce rapport..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Période d'analyse</Label>
                    <Select value={reportConfig.period} onValueChange={(value) => setReportConfig(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map(period => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {reportConfig.period === 'custom' && (
                    <div className="space-y-2">
                      <Label>Période personnalisée</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {reportConfig.dateRange.from ? (
                              reportConfig.dateRange.to ? (
                                `${format(reportConfig.dateRange.from, 'dd MMM', { locale: fr })} - ${format(reportConfig.dateRange.to, 'dd MMM yyyy', { locale: fr })}`
                              ) : (
                                format(reportConfig.dateRange.from, 'dd MMM yyyy', { locale: fr })
                              )
                            ) : (
                              "Sélectionner les dates"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: reportConfig.dateRange.from,
                              to: reportConfig.dateRange.to
                            }}
                            onSelect={(range) => setReportConfig(prev => ({ 
                              ...prev, 
                              dateRange: { from: range?.from, to: range?.to }
                            }))}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>

              {/* Options avancées */}
              <div className="space-y-4 border-t pt-6">
                <Label className="text-base font-medium">3. Options avancées</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Données à inclure</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="realData"
                          checked={reportConfig.includeRealData}
                          onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeRealData: checked as boolean }))}
                        />
                        <Label htmlFor="realData" className="text-sm">Données temps réel (APIs)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="aiContext"
                          checked={reportConfig.includeAIContext}
                          onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeAIContext: checked as boolean }))}
                        />
                        <Label htmlFor="aiContext" className="text-sm">Analyse IA automatique</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="demographics"
                          checked={reportConfig.includeDemographics}
                          onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeDemographics: checked as boolean }))}
                        />
                        <Label htmlFor="demographics" className="text-sm">Données démographiques</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="influencers"
                          checked={reportConfig.includeInfluencers}
                          onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeInfluencers: checked as boolean }))}
                        />
                        <Label htmlFor="influencers" className="text-sm">Profils d'influenceurs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="geography"
                          checked={reportConfig.includeGeography}
                          onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeGeography: checked as boolean }))}
                        />
                        <Label htmlFor="geography" className="text-sm">Répartition géographique</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Plateformes ciblées</h4>
                    <div className="space-y-2">
                      {platforms.map(platform => (
                        <div key={platform.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={platform.value}
                            checked={reportConfig.platforms.includes(platform.value)}
                            onCheckedChange={(checked) => handlePlatformChange(platform.value, checked as boolean)}
                          />
                          <Label htmlFor={platform.value} className="text-sm">{platform.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedType === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Mots-clés personnalisés (séparés par des virgules)</Label>
                    <Input
                      id="keywords"
                      value={reportConfig.customKeywords}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, customKeywords: e.target.value }))}
                      placeholder="gay, lgbt, woubi, fierté, discrimination..."
                    />
                  </div>
                )}
              </div>

              {/* Aperçu du rapport */}
              {selectedReportType && (
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Aperçu du rapport</h4>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <selectedReportType.icon className="w-6 h-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{reportConfig.title || selectedReportType.label}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reportConfig.description || selectedReportType.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">Format: {reportConfig.format.toUpperCase()}</Badge>
                            <Badge variant="outline">Période: {periods.find(p => p.value === reportConfig.period)?.label}</Badge>
                            {reportConfig.platforms.length > 0 && (
                              <Badge variant="outline">{reportConfig.platforms.length} plateformes</Badge>
                            )}
                            {reportConfig.includeAIContext && <Badge variant="outline">IA incluse</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Bouton de génération */}
              <div className="border-t pt-6 flex justify-end">
                <Button 
                  onClick={generateCustomReport}
                  disabled={isGenerating || !reportConfig.title}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      🚀 Générer le rapport
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Barre de progression */}
      {isGenerating && (
        <ReportGenerationProgress 
          progress={progress} 
          onCancel={cancelGeneration}
        />
      )}

      {/* Derniers rapports générés */}
      {generatedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Derniers rapports générés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{report.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.generatedAt).toLocaleDateString('fr-FR')} • {report.format.toUpperCase()} • {report.size}
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