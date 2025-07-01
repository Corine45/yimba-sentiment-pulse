
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SaveSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchName: string;
  onSearchNameChange: (name: string) => void;
  onSave: () => void;
  keywords: string[];
  selectedPlatforms: string[];
}

export const SaveSearchDialog = ({
  open,
  onOpenChange,
  searchName,
  onSearchNameChange,
  onSave,
  keywords,
  selectedPlatforms
}: SaveSearchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sauvegarder la recherche</DialogTitle>
          <DialogDescription>
            Donnez un nom à cette recherche pour la retrouver facilement.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="searchName">Nom de la recherche</Label>
            <Input
              id="searchName"
              value={searchName}
              onChange={(e) => onSearchNameChange(e.target.value)}
              placeholder="Ex: Veille concurrence"
            />
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Mots-clés:</strong> {keywords.join(', ')}</p>
            <p><strong>Plateformes:</strong> {selectedPlatforms.join(', ')}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
