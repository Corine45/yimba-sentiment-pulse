
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { HealthRole } from "../../../utils/healthPermissions";
import { NewUserForm } from "../types/healthUser";

interface AddUserDialogProps {
  onAddUser: (user: NewUserForm) => boolean;
}

export const AddUserDialog = ({ onAddUser }: AddUserDialogProps) => {
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "observateur_partenaire"
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddUser = () => {
    const success = onAddUser(newUser);
    if (success) {
      setNewUser({ name: "", email: "", role: "observateur_partenaire" });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur au module</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="userName">Nom complet</Label>
            <Input
              id="userName"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Dr. Jean Dupont"
            />
          </div>
          <div>
            <Label htmlFor="userEmail">Email professionnel</Label>
            <Input
              id="userEmail"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Ex: jean.dupont@sante.gouv.fr"
            />
          </div>
          <div>
            <Label htmlFor="userRole">Rôle dans le module</Label>
            <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as HealthRole }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_sante">Admin Santé</SelectItem>
                <SelectItem value="analyste_sanitaire">Analyste Sanitaire</SelectItem>
                <SelectItem value="observateur_partenaire">Observateur/Partenaire</SelectItem>
                <SelectItem value="formateur_accompagnateur">Formateur/Accompagnateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUser}>
              Envoyer l'invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
