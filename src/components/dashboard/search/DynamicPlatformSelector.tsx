
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePlatforms } from "@/hooks/usePlatforms";
import { Badge } from "@/components/ui/badge";

interface DynamicPlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
}

export const DynamicPlatformSelector = ({ selectedPlatforms, onPlatformChange }: DynamicPlatformSelectorProps) => {
  const { platforms, loading } = usePlatforms();

  const handlePlatformToggle = (platformName: string, checked: boolean) => {
    console.log(`🎯 Filtre plateforme: ${platformName} ${checked ? 'sélectionné' : 'désélectionné'}`);
    
    if (checked) {
      const newPlatforms = [...selectedPlatforms, platformName];
      console.log('📋 Plateformes sélectionnées:', newPlatforms);
      onPlatformChange(newPlatforms);
    } else {
      const newPlatforms = selectedPlatforms.filter(p => p !== platformName);
      console.log('📋 Plateformes restantes:', newPlatforms);
      onPlatformChange(newPlatforms);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Label>Plateformes sociales</Label>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>Plateformes sociales disponibles</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex items-center space-x-2">
            <Checkbox 
              id={platform.id}
              checked={selectedPlatforms.includes(platform.name)}
              onCheckedChange={(checked) => handlePlatformToggle(platform.name, !!checked)}
            />
            <Label htmlFor={platform.id} className="text-sm flex items-center space-x-2">
              <span>{platform.name}</span>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                API ✓
              </Badge>
            </Label>
          </div>
        ))}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Plateformes sélectionnées:</strong> {selectedPlatforms.join(', ')}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Les données seront récupérées uniquement depuis ces plateformes via leurs APIs respectives.
          </p>
        </div>
      )}
      
      {platforms.length === 0 && (
        <p className="text-sm text-gray-500">Aucune plateforme disponible</p>
      )}
    </div>
  );
};
