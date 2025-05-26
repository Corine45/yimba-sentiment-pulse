
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Play, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApifyConfigurationProps {
  apiToken: string;
  setApiToken: (token: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  targetInput: string;
  setTargetInput: (input: string) => void;
  isLoading: boolean;
  onScrape: () => void;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
  };
}

export const ApifyConfiguration = ({
  apiToken,
  setApiToken,
  isConnected,
  setIsConnected,
  selectedPlatform,
  setSelectedPlatform,
  targetInput,
  setTargetInput,
  isLoading,
  onScrape,
  permissions
}: ApifyConfigurationProps) => {
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

  return (
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
              onClick={onScrape} 
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
  );
};
