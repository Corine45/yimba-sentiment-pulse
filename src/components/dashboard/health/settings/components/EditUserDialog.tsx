
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthRole } from "../../../utils/healthPermissions";
import { HealthUser } from "../types/healthUser";

interface EditUserDialogProps {
  user: HealthUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: HealthUser) => void;
  onUserChange: (user: HealthUser) => void;
}

export const EditUserDialog = ({ 
  user, 
  isOpen, 
  onClose, 
  onUpdateUser, 
  onUserChange 
}: EditUserDialogProps) => {
  const handleUpdate = () => {
    if (user) {
      onUpdateUser(user);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editName">Nom complet</Label>
            <Input
              id="editName"
              value={user.name}
              onChange={(e) => onUserChange({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="editEmail">Email</Label>
            <Input
              id="editEmail"
              value={user.email}
              onChange={(e) => onUserChange({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="editRole">Rôle</Label>
            <Select value={user.role} onValueChange={(value) => onUserChange({ ...user, role: value as HealthRole })}>
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
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
