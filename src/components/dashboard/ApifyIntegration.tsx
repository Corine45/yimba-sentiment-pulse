
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ApifyService, { EngagementData } from "@/services/apifyService";
import { ApifyConfiguration } from "./apify/ApifyConfiguration";
import { ApifyResults } from "./apify/ApifyResults";

interface ApifyIntegrationProps {
  userRole: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
  };
}

export const ApifyIntegration = ({ userRole, permissions }: ApifyIntegrationProps) => {
  const [apiToken, setApiToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const { toast } = useToast();

  const handleScrape = async () => {
    if (!isConnected || !selectedPlatform || !targetInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez configurer tous les paramètres avant de démarrer le scraping",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const apifyService = new ApifyService(apiToken);
      let results: EngagementData[] = [];

      switch (selectedPlatform) {
        case 'instagram':
          results = await apifyService.scrapeInstagram(targetInput);
          break;
        case 'twitter':
          results = await apifyService.scrapeTwitter(targetInput);
          break;
        case 'facebook':
          results = await apifyService.scrapeFacebook(targetInput);
          break;
        case 'tiktok':
          results = await apifyService.scrapeTikTok(targetInput);
          break;
        default:
          throw new Error('Plateforme non supportée');
      }

      setEngagementData(results);
      toast({
        title: "Scraping terminé",
        description: `${results.length} posts récupérés avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors du scraping:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du scraping",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ApifyConfiguration
        apiToken={apiToken}
        setApiToken={setApiToken}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        targetInput={targetInput}
        setTargetInput={setTargetInput}
        isLoading={isLoading}
        onScrape={handleScrape}
        permissions={permissions}
      />

      <ApifyResults
        engagementData={engagementData}
        selectedPlatform={selectedPlatform}
        permissions={permissions}
      />
    </div>
  );
};
