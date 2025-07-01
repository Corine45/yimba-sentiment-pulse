
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DynamicKeywordManager } from "./DynamicKeywordManager";
import { DynamicPlatformSelector } from "./DynamicPlatformSelector";

interface SearchConfigurationProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  period: string;
  onPeriodChange: (period: string) => void;
}

export const SearchConfiguration = ({
  keywords,
  onKeywordsChange,
  selectedPlatforms,
  onPlatformChange,
  language,
  onLanguageChange,
  period,
  onPeriodChange
}: SearchConfigurationProps) => {
  return (
    <div className="space-y-6">
      <DynamicKeywordManager
        keywords={keywords}
        onKeywordsChange={onKeywordsChange}
      />
      
      <DynamicPlatformSelector
        selectedPlatforms={selectedPlatforms}
        onPlatformChange={onPlatformChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Langue</Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
              <SelectItem value="all">Toutes langues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Période</Label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
