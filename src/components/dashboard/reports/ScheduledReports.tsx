import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Plus, Settings, Trash2, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
  recipients: string[];
  format: string;
}

export const ScheduledReports = () => {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Rapport Hebdomadaire LGBT+",
      type: "sentiment",
      frequency: "weekly",
      nextRun: "2024-12-15T09:00:00",
      lastRun: "2024-12-08T09:00:00",
      isActive: true,
      recipients: ["admin@yimba.com"],
      format: "pdf"
    },
    {
      id: "2", 
      name: "Veille Quotidienne",
      type: "mentions",
      frequency: "daily",
      nextRun: "2024-12-08T08:00:00",
      isActive: false,
      recipients: ["team@yimba.com"],
      format: "html"
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    type: "",
    frequency: "",
    recipients: "",
    format: "pdf"
  });

  const reportTypes = [
    { value: "mentions", label: "📊 Rapport de Mentions", description: "Analyse complète des mentions" },
    { value: "sentiment", label: "😊 Analyse de Sentiment", description: "Sentiment positif, négatif et neutre" },
    { value: "engagement", label: "❤️ Rapport d'Engagement", description: "Likes, partages, commentaires" },
    { value: "demographic", label: "👥 Rapport Démographique", description: "Âge, genre et profils" },
    { value: "geographic", label: "🌍 Rapport Géographique", description: "Répartition par pays et régions" },
    { value: "custom", label: "🔄 Rapport Personnalisé", description: "Critères personnalisés" }
  ];

  const frequencies = [
    { value: "daily", label: "Quotidien", description: "Tous les jours à 8h00" },
    { value: "weekly", label: "Hebdomadaire", description: "Tous les lundis à 9h00" },
    { value: "monthly", label: "Mensuel", description: "Le 1er de chaque mois" },
    { value: "custom", label: "Personnalisé", description: "Définir une fréquence spécifique" }
  ];

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge variant="secondary">Inactif</Badge>
    );
  };

  const getFrequencyLabel = (frequency: string) => {
    const freq = frequencies.find(f => f.value === frequency);
    return freq?.label || frequency;
  };

  const toggleReportStatus = (id: string) => {
    setScheduledReports(prev => 
      prev.map(report => 
        report.id === id 
          ? { ...report, isActive: !report.isActive }
          : report
      )
    );
    toast.success("Statut du rapport modifié");
  };

  const deleteReport = (id: string) => {
    setScheduledReports(prev => prev.filter(report => report.id !== id));
    toast.success("Rapport programmé supprimé");
  };

  const createReport = () => {
    if (!newReport.name || !newReport.type || !newReport.frequency) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      type: newReport.type,
      frequency: newReport.frequency,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      recipients: newReport.recipients.split(",").map(email => email.trim()),
      format: newReport.format
    };

    setScheduledReports(prev => [...prev, report]);
    setNewReport({ name: "", type: "", frequency: "", recipients: "", format: "pdf" });
    setShowCreateDialog(false);
    toast.success("Rapport programmé créé avec succès");
  };

  const runReportNow = (id: string) => {
    const report = scheduledReports.find(r => r.id === id);
    if (report) {
      toast.success(`Génération du rapport "${report.name}" en cours...`);
      // Ici on déclencherait la génération du rapport
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>📅 Rapports programmés</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Automatisez la génération de vos rapports
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau rapport
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un rapport programmé</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du rapport *</Label>
                    <Input
                      id="name"
                      value={newReport.name}
                      onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Rapport hebdomadaire LGBT+"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type de rapport *</Label>
                    <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le type de rapport" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence *</Label>
                    <Select value={newReport.frequency} onValueChange={(value) => setNewReport(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map(freq => (
                          <SelectItem key={freq.value} value={freq.value}>
                            <div>
                              <div className="font-medium">{freq.label}</div>
                              <div className="text-xs text-muted-foreground">{freq.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format de sortie</Label>
                    <Select value={newReport.format} onValueChange={(value) => setNewReport(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Destinataires (emails séparés par des virgules)</Label>
                    <Input
                      id="recipients"
                      value={newReport.recipients}
                      onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                      placeholder="admin@yimba.com, team@yimba.com"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={createReport}>
                      Créer le rapport
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun rapport programmé</p>
                <p className="text-sm">Créez votre premier rapport automatisé</p>
              </div>
            ) : (
              scheduledReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4 flex-1">
                    <Clock className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{report.name}</h4>
                        {getStatusBadge(report.isActive)}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>Type: {reportTypes.find(t => t.value === report.type)?.label}</span>
                        <span>Fréquence: {getFrequencyLabel(report.frequency)}</span>
                        <span>Format: {report.format.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>Prochaine exécution: {new Date(report.nextRun).toLocaleDateString('fr-FR')} {new Date(report.nextRun).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        {report.lastRun && (
                          <span>Dernière exécution: {new Date(report.lastRun).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runReportNow(report.id)}
                      disabled={!report.isActive}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Exécuter
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReportStatus(report.id)}
                    >
                      {report.isActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Activer
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReport(report.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {scheduledReports.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Fonctionnalités avancées</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Les rapports sont générés automatiquement selon la fréquence définie</p>
                <p>• Notification par email envoyée aux destinataires</p>
                <p>• Sauvegarde automatique dans Supabase</p>
                <p>• Possibilité de personnaliser les critères de chaque rapport</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};