
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface KeywordManagerProps {
  keywords: string[];
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  onUpdateKeyword: (index: number, value: string) => void;
}

export const KeywordManager = ({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  onUpdateKeyword
}: KeywordManagerProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Mots-clés à surveiller</Label>
      {keywords.map((keyword, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Entrez un mot-clé..."
            value={keyword}
            onChange={(e) => onUpdateKeyword(index, e.target.value)}
            className="flex-1"
          />
          {keywords.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveKeyword(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAddKeyword}>
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un mot-clé
      </Button>
    </div>
  );
};
