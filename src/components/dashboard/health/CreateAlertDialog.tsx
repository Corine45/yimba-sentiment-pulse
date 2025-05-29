
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateAlertDialogProps {
  onCreateAlert: (alert: any) => void;
}

export const CreateAlertDialog = ({ onCreateAlert }: CreateAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    disease: "",
    location: "",
    severity: "",
    description: "",
    source: "",
    rawText: "",
    reporterName: "",
    reporterContact: ""
  });
  const { toast } = useToast();

  const diseases = [
    "COVID-19", "Paludisme", "Dengue", "Rougeole", "Choléra", 
    "Fièvre Jaune", "Méningite", "Tuberculose", "VIH", "Autre"
  ];

  const locations = [
    "Abidjan", "Bouaké", "San Pedro", "Korhogo", "Daloa", 
    "Man", "Gagnoa", "Divo", "Yamoussoukro", "Autre"
  ];

  const sources = [
    "Signalement direct", "Réseaux sociaux", "Centre de santé", 
    "Pharmacie", "ONG partenaire", "Autorités locales", "Autre"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.disease || !formData.location || !formData.severity || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const newAlert = {
      id: `HS${String(Date.now()).slice(-3)}`,
      disease: formData.disease,
      location: formData.location,
      severity: formData.severity,
      status: "nouveau",
      timestamp: new Date().toLocaleString('fr-FR'),
      source: formData.source,
      description: formData.description,
      verified: false,
      assignedTo: null,
      rawText: formData.rawText || formData.description,
      reporterName: formData.reporterName,
      reporterContact: formData.reporterContact,
      createdAt: new Date().toISOString()
    };

    onCreateAlert(newAlert);
    
    toast({
      title: "Alerte créée",
      description: `Nouvelle alerte ${newAlert.id} créée avec succès`,
    });

    // Reset form
    setFormData({
      disease: "",
      location: "",
      severity: "",
      description: "",
      source: "",
      rawText: "",
      reporterName: "",
      reporterContact: ""
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle alerte
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Créer une nouvelle alerte sanitaire
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disease">Maladie/Condition *</Label>
              <Select value={formData.disease} onValueChange={(value) => setFormData({...formData, disease: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une maladie" />
                </SelectTrigger>
                <SelectContent>
                  {diseases.map((disease) => (
                    <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une localisation" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Niveau de gravité *</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la gravité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Faible
                    </div>
                  </SelectItem>
                  <SelectItem value="modéré">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                      Modéré
                    </div>
                  </SelectItem>
                  <SelectItem value="critique">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      Critique
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source du signalement *</Label>
              <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description de l'alerte *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez la situation sanitaire observée..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawText">Message/Texte original</Label>
            <Textarea
              id="rawText"
              placeholder="Texte original du signalement (optionnel)"
              value={formData.rawText}
              onChange={(e) => setFormData({...formData, rawText: e.target.value})}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reporterName">Nom du rapporteur</Label>
              <Input
                id="reporterName"
                placeholder="Nom de la personne qui signale"
                value={formData.reporterName}
                onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporterContact">Contact du rapporteur</Label>
              <Input
                id="reporterContact"
                placeholder="Téléphone ou email"
                value={formData.reporterContact}
                onChange={(e) => setFormData({...formData, reporterContact: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'alerte
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
