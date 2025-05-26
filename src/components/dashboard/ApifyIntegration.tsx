
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Play, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApifyService, { EngagementData } from "@/services/apifyService";

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

  const handleConnect = () => {
    if (!apiToken.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre token API Apify",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnected(true);
    toast({
      title: "Connecté",
      description: "Connexion à Apify établie avec succès",
    });
  };

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

  const getTotalEngagement = () => {
    return engagementData.reduce((total, item) => {
      return {
        likes: total.likes + item.likes,
        comments: total.comments + item.comments,
        shares: total.shares + item.shares,
      };
    }, { likes: 0, comments: 0, shares: 0 });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(engagementData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apify_engagement_${selectedPlatform}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Configuration Apify */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Configuration Apify</span>
            {isConnected && <CheckCircle className="w-5 h-5 text-green-600" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Vous avez besoin d'un token API Apify pour utiliser cette fonctionnalité.
                    <a href="https://console.apify.com/account#/integrations" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                      Obtenez votre token ici
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Token API Apify</label>
                <Input
                  type="password"
                  placeholder="Entrez votre token API Apify"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
              </div>
              
              <Button onClick={handleConnect}>
                Se connecter à Apify
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✅ Connecté à Apify avec succès</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plateforme</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {selectedPlatform === 'facebook' ? 'URL de la page' : 'Nom d\'utilisateur'}
                  </label>
                  <Input
                    placeholder={
                      selectedPlatform === 'facebook' 
                        ? "https://facebook.com/page-name" 
                        : "@username ou username"
                    }
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleScrape} 
                disabled={isLoading || !permissions.canSearch}
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                <Play className="w-4 h-4 mr-2" />
                {isLoading ? "Scraping en cours..." : "Démarrer le scraping"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {engagementData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Données d'engagement récupérées</CardTitle>
              {permissions.canExportData && (
                <Button variant="outline" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{engagementData.length}</div>
                    <div className="text-sm text-blue-800">Posts analysés</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{getTotalEngagement().likes.toLocaleString()}</div>
                    <div className="text-sm text-red-800">J'aime total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{getTotalEngagement().comments.toLocaleString()}</div>
                    <div className="text-sm text-green-800">Commentaires total</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{getTotalEngagement().shares.toLocaleString()}</div>
                    <div className="text-sm text-purple-800">Partages total</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {engagementData.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{item.platform}</Badge>
                          <span className="text-sm font-medium">{item.author}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span>❤️ {item.likes}</span>
                          <span>💬 {item.comments}</span>
                          <span>🔄 {item.shares}</span>
                        </div>
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline"
                          >
                            Voir le post
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
