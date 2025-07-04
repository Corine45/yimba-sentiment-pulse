
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const AVAILABLE_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', description: 'Posts, Pages & URLs' },
  { id: 'instagram', name: 'Instagram', description: 'Posts, Reels & Hashtags' },
  { id: 'twitter', name: 'X (Twitter)', description: 'Tweets & Réponses' },
  { id: 'tiktok', name: 'TikTok', description: 'Hashtags & Géolocalisation' },
  { id: 'youtube', name: 'YouTube', description: 'Vidéos & Commentaires' },
  { id: 'videos', name: 'Videos', description: 'Contenu vidéo' },
  { id: 'podcasts', name: 'Podcasts', description: 'Audio & Podcasts' },
  { id: 'blogs', name: 'Blogs', description: 'Articles de blog' },
  { id: 'news', name: 'News', description: 'Articles de presse' },
  { id: 'web', name: 'Web', description: 'Sites web généraux' },
  { id: 'other_socials', name: 'Other Socials', description: 'Autres réseaux' }
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  platformCounts: { [key: string]: number };
}

export const PlatformSelector = ({ 
  selectedPlatforms, 
  onPlatformsChange, 
  platformCounts 
}: PlatformSelectorProps) => {
  const togglePlatform = (platformId: string) => {
    onPlatformsChange(
      selectedPlatforms.includes(platformId)
        ? selectedPlatforms.filter(p => p !== platformId)
        : [...selectedPlatforms, platformId]
    );
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center space-x-2">
        <span>Sources</span>
        <Badge variant="outline">{selectedPlatforms.length} connectées</Badge>
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {AVAILABLE_PLATFORMS.map((platform) => (
          <div key={platform.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
            <Checkbox
              id={platform.id}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => togglePlatform(platform.id)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={platform.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {platform.name}
                {platformCounts[platform.name] && (
                  <Badge variant="outline" className="ml-2">
                    {platformCounts[platform.name]}
                  </Badge>
                )}
              </label>
              <p className="text-xs text-muted-foreground">
                {platform.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
