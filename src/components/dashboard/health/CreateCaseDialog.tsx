
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateCaseDialogProps {
  onCreateCase: (newCase: any) => void;
}

export const CreateCaseDialog = ({ onCreateCase }: CreateCaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    disease: "",
    location: "",
    priority: "normale",
    assignedTo: "",
    description: "",
    alertId: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCase = {
      id: `CASE${String(Date.now()).slice(-3)}`,
      ...formData,
      status: "nouveau",
      createdAt: new Date().toISOString().split('T')[0],
      actions: 0,
      lastUpdate: new Date().toISOString()
    };

    onCreateCase(newCase);
    
    toast({
      title: "Cas créé",
      description: `Le cas ${newCase.id} a été créé avec succès`,
    });

    setFormData({
      disease: "",
      location: "",
      priority: "normale",
      assignedTo: "",
      description: "",
      alertId: ""
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau cas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-blue-500" />
            Créer un nouveau cas
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="disease">Maladie/Condition *</Label>
              <Input
                id="disease"
                value={formData.disease}
                onChange={(e) => handleInputChange("disease", e.target.value)}
                placeholder="Ex: COVID-19, Paludisme..."
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Ex: Abidjan, Cocody"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible">Faible</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigner à</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un assigné" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Non assigné</SelectItem>
                  <SelectItem value="Dr. Kouassi">Dr. Kouassi</SelectItem>
                  <SelectItem value="Dr. Traore">Dr. Traore</SelectItem>
                  <SelectItem value="Dr. Diabaté">Dr. Diabaté</SelectItem>
                  <SelectItem value="Équipe mobile">Équipe mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="alertId">ID Alerte source (optionnel)</Label>
            <Input
              id="alertId"
              value={formData.alertId}
              onChange={(e) => handleInputChange("alertId", e.target.value)}
              placeholder="Ex: HS001"
            />
          </div>

          <div>
            <Label htmlFor="description">Description du cas *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Décrivez la situation, les symptômes observés, le contexte..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le cas
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
