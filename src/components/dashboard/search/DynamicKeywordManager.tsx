
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DynamicKeywordManagerProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export const DynamicKeywordManager = ({ keywords, onKeywordsChange }: DynamicKeywordManagerProps) => {
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      onKeywordsChange([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    onKeywordsChange(keywords.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-3">
      <Label>Mots-clés à surveiller</Label>
      
      <div className="flex space-x-2">
        <Input
          placeholder="Ajouter un mot-clé..."
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={addKeyword}
          disabled={!newKeyword.trim()}
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {keywords.length === 0 && (
        <p className="text-sm text-gray-500">Aucun mot-clé ajouté</p>
      )}
    </div>
  );
};
