
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface KeywordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export const KeywordInput = ({ keywords, onKeywordsChange }: KeywordInputProps) => {
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      onKeywordsChange([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(keywords.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-3">
      <Label>Mots-clés à surveiller</Label>
      <div className="flex space-x-2">
        <Input
          placeholder="Ajouter un mot-clé..."
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={addKeyword} disabled={!currentKeyword.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
            <span>{keyword}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => removeKeyword(keyword)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
