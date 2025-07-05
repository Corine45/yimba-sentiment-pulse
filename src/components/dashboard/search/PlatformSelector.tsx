
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Globe, Search, Youtube, Chrome } from "lucide-react";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  platformCounts?: { [key: string]: number };
}

const PLATFORMS = [
  { 
    id: 'facebook', 
    name: 'Facebook', 
    color: 'bg-blue-600',
    description: 'Posts, Pages, Reviews, Posts Ideal'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    color: 'bg-pink-500',
    description: 'Posts, Profile, Comments, Hashtags'
  },
  { 
    id: 'twitter', 
    name: 'Twitter/X', 
    color: 'bg-black',
    description: 'Tweets, Replies, Threads'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    color: 'bg-black',
    description: 'Hashtags, Location, Videos'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    color: 'bg-red-600',
    description: 'Videos, Channels, Comments',
    icon: Youtube
  },
  { 
    id: 'google', 
    name: 'Google Search', 
    color: 'bg-green-600',
    description: 'Recherche web, actualités',
    icon: Search,
    isNew: true
  },
  { 
    id: 'web', 
    name: 'Web Scraping', 
    color: 'bg-purple-600',
    description: 'Sites web, blogs, pages',
    icon: Chrome,
    isNew: true
  }
];

export const PlatformSelector = ({ 
  selectedPlatforms, 
  onPlatformsChange, 
  platformCounts = {} 
}: PlatformSelectorProps) => {
  const handlePlatformToggle = (platformId: string) => {
    const isSelected = selectedPlatforms.includes(platformId);
    if (isSelected) {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platformId));
    } else {
      onPlatformsChange([...selectedPlatforms, platformId]);
    }
  };

  const selectAll = () => {
    onPlatformsChange(PLATFORMS.map(p => p.id));
  };

  const clearAll = () => {
    onPlatformsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Plateformes enrichies</Label>
        <div className="flex space-x-2">
          <button 
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Tout sélectionner
          </button>
          <span className="text-gray-400">|</span>
          <button 
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Tout désélectionner
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const count = platformCounts[platform.name] || platformCounts[platform.id] || 0;
          const Icon = platform.icon || Globe;
          
          return (
            <div 
              key={platform.id}
              className={`
                relative border rounded-lg p-3 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={platform.id}
                  checked={isSelected}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${platform.color}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <Label 
                      htmlFor={platform.id} 
                      className="font-medium cursor-pointer"
                    >
                      {platform.name}
                    </Label>
                    {platform.isNew && (
                      <Badge variant="secondary" className="text-xs">
                        NOUVEAU
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {platform.description}
                  </p>
                  
                  {count > 0 && (
                    <Badge variant="outline" className="text-xs mt-2">
                      {count} mentions
                    </Badge>
                  )}
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Sélectionnées:</span>
          {selectedPlatforms.map(platformId => {
            const platform = PLATFORMS.find(p => p.id === platformId);
            return platform ? (
              <Badge key={platformId} variant="secondary" className="text-xs">
                {platform.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};
