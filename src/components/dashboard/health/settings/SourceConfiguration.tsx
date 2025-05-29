
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Globe, Key, Settings, CheckCircle, XCircle, Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataSource {
  id: string;
  name: string;
  type: "social" | "web" | "api";
  url?: string;
  isActive: boolean;
  lastSync?: string;
  status: "connected" | "error" | "pending";
}

export const SourceConfiguration = () => {
  const { toast } = useToast();
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Twitter API",
      type: "social",
      url: "api.twitter.com",
      isActive: true,
      lastSync: "2024-01-15 14:30",
      status: "connected"
    },
    {
      id: "2",
      name: "Facebook Graph API",
      type: "social",
      url: "graph.facebook.com",
      isActive: false,
      lastSync: "2024-01-10 09:15",
      status: "error"
    },
    {
      id: "3",
      name: "Site OMS",
      type: "web",
      url: "who.int",
      isActive: true,
      lastSync: "2024-01-15 16:45",
      status: "connected"
    },
    {
      id: "4",
      name: "Ministère de la Santé",
      type: "web",
      url: "sante.gouv.fr",
      isActive: true,
      lastSync: "2024-01-15 12:20",
      status: "connected"
    }
  ]);

  const [newSource, setNewSource] = useState({ name: "", url: "", type: "web" as const });
  const [isAddingSource, setIsAddingSource] = useState(false);

  const handleToggleSource = (id: string) => {
    setSources(prev => prev.map(source => 
      source.id === id ? { ...source, isActive: !source.isActive } : source
    ));
    toast({
      title: "Source mise à jour",
      description: "Le statut de la source a été modifié.",
    });
  };

  const handleAddSource = () => {
    if (!newSource.name || !newSource.url) return;
    
    const source: DataSource = {
      id: Date.now().toString(),
      name: newSource.name,
      url: newSource.url,
      type: newSource.type,
      isActive: true,
      status: "pending"
    };
    
    setSources(prev => [...prev, source]);
    setNewSource({ name: "", url: "", type: "web" });
    setIsAddingSource(false);
    
    toast({
      title: "Source ajoutée",
      description: "La nouvelle source a été configurée avec succès.",
    });
  };

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
    toast({
      title: "Source supprimée",
      description: "La source a été retirée de la surveillance.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-yellow-600 animate-spin" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "social":
        return <Globe className="w-4 h-4 text-blue-600" />;
      case "web":
        return <Database className="w-4 h-4 text-green-600" />;
      case "api":
        return <Key className="w-4 h-4 text-purple-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Configuration des sources de données
          </span>
          <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle source</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sourceName">Nom de la source</Label>
                  <Input
                    id="sourceName"
                    value={newSource.name}
                    onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Reddit API"
                  />
                </div>
                <div>
                  <Label htmlFor="sourceUrl">URL ou endpoint</Label>
                  <Input
                    id="sourceUrl"
                    value={newSource.url}
                    onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Ex: reddit.com/api"
                  />
                </div>
                <div>
                  <Label htmlFor="sourceType">Type de source</Label>
                  <select
                    id="sourceType"
                    value={newSource.type}
                    onChange={(e) => setNewSource(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="web">Site web</option>
                    <option value="social">Réseau social</option>
                    <option value="api">API externe</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingSource(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddSource}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sources">Sources actives</TabsTrigger>
            <TabsTrigger value="monitoring">Paramètres de surveillance</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid gap-4">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(source.type)}
                    <div>
                      <h4 className="font-medium">{source.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{source.url}</span>
                        {source.lastSync && (
                          <span>• Dernière sync: {source.lastSync}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(source.status)}
                    <Switch
                      checked={source.isActive}
                      onCheckedChange={() => handleToggleSource(source.id)}
                    />
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSource(source.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Fréquence de surveillance</h4>
                <div className="space-y-2">
                  <Label>Intervalle (minutes)</Label>
                  <Input type="number" defaultValue="15" min="1" max="60" />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Limite de requêtes</h4>
                <div className="space-y-2">
                  <Label>Requêtes par heure</Label>
                  <Input type="number" defaultValue="1000" min="100" max="10000" />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Retry automatique</h4>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Réessayer en cas d'échec</Label>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Notifications</h4>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Alerter en cas d'erreur</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
