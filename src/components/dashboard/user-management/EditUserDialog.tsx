
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types/user";

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onUpdate: (user: User) => Promise<void>;
  onUserChange: (user: User) => void;
}

export const EditUserDialog = ({ user, onClose, onUpdate, onUserChange }: EditUserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
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
            <Select value={user.role} onValueChange={(value: any) => onUserChange({ ...user, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="analyste">Analyste</SelectItem>
                <SelectItem value="observateur">Observateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={() => onUpdate(user)}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
