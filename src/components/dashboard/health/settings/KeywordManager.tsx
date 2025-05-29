
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit2, Trash2, Tag, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Keyword {
  id: string;
  term: string;
  category: "symptome" | "maladie" | "lieu" | "medicament" | "autre";
  weight: number;
  isActive: boolean;
  detectionCount: number;
  lastDetected?: string;
}

export const KeywordManager = () => {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: "1",
      term: "fièvre",
      category: "symptome",
      weight: 3,
      isActive: true,
      detectionCount: 245,
      lastDetected: "2024-01-15 14:30"
    },
    {
      id: "2", 
      term: "covid",
      category: "maladie",
      weight: 5,
      isActive: true,
      detectionCount: 189,
      lastDetected: "2024-01-15 16:45"
    },
    {
      id: "3",
      term: "Paris",
      category: "lieu",
      weight: 2,
      isActive: true,
      detectionCount: 67,
      lastDetected: "2024-01-15 12:20"
    },
    {
      id: "4",
      term: "paracétamol",
      category: "medicament",
      weight: 1,
      isActive: true,
      detectionCount: 34,
      lastDetected: "2024-01-14 09:15"
    },
    {
      id: "5",
      term: "grippe",
      category: "maladie",
      weight: 4,
      isActive: true,
      detectionCount: 156,
      lastDetected: "2024-01-15 11:30"
    }
  ]);

  const [newKeyword, setNewKeyword] = useState({
    term: "",
    category: "symptome" as const,
    weight: 1
  });
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [isEditingKeyword, setIsEditingKeyword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredKeywords = keywords.filter(keyword =>
    keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keyword.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKeyword = () => {
    if (!newKeyword.term) return;
    
    const keyword: Keyword = {
      id: Date.now().toString(),
      term: newKeyword.term.toLowerCase(),
      category: newKeyword.category,
      weight: newKeyword.weight,
      isActive: true,
      detectionCount: 0
    };
    
    setKeywords(prev => [...prev, keyword]);
    setNewKeyword({ term: "", category: "symptome", weight: 1 });
    setIsAddingKeyword(false);
    
    toast({
      title: "Mot-clé ajouté",
      description: "Le nouveau terme est maintenant surveillé.",
    });
  };

  const handleEditKeyword = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsEditingKeyword(true);
  };

  const handleUpdateKeyword = () => {
    if (!selectedKeyword) return;
    
    setKeywords(prev => prev.map(keyword => 
      keyword.id === selectedKeyword.id ? selectedKeyword : keyword
    ));
    setIsEditingKeyword(false);
    setSelectedKeyword(null);
    
    toast({
      title: "Mot-clé mis à jour",
      description: "Les paramètres ont été sauvegardés.",
    });
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords(prev => prev.filter(keyword => keyword.id !== id));
    toast({
      title: "Mot-clé supprimé",
      description: "Le terme n'est plus surveillé.",
    });
  };

  const handleToggleKeyword = (id: string) => {
    setKeywords(prev => prev.map(keyword => 
      keyword.id === id ? { ...keyword, isActive: !keyword.isActive } : keyword
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "symptome":
        return "bg-red-100 text-red-800";
      case "maladie":
        return "bg-orange-100 text-orange-800";
      case "lieu":
        return "bg-blue-100 text-blue-800";
      case "medicament":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryStats = () => {
    const stats = keywords.reduce((acc, keyword) => {
      if (keyword.isActive) {
        acc[keyword.category] = (acc[keyword.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { category: "symptome", count: stats.symptome || 0, label: "Symptômes" },
      { category: "maladie", count: stats.maladie || 0, label: "Maladies" },
      { category: "lieu", count: stats.lieu || 0, label: "Lieux" },
      { category: "medicament", count: stats.medicament || 0, label: "Médicaments" }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Tag className="w-5 h-5 mr-2 text-green-600" />
            Gestion des mots-clés et expressions
          </span>
          <Dialog open={isAddingKeyword} onOpenChange={setIsAddingKeyword}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un mot-clé
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau mot-clé</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keywordTerm">Terme ou expression</Label>
                  <Input
                    id="keywordTerm"
                    value={newKeyword.term}
                    onChange={(e) => setNewKeyword(prev => ({ ...prev, term: e.target.value }))}
                    placeholder="Ex: mal de tête, épidémie..."
                  />
                </div>
                <div>
                  <Label htmlFor="keywordCategory">Catégorie</Label>
                  <select
                    id="keywordCategory"
                    value={newKeyword.category}
                    onChange={(e) => setNewKeyword(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="symptome">Symptôme</option>
                    <option value="maladie">Maladie</option>
                    <option value="lieu">Lieu</option>
                    <option value="medicament">Médicament</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="keywordWeight">Poids (importance)</Label>
                  <select
                    id="keywordWeight"
                    value={newKeyword.weight}
                    onChange={(e) => setNewKeyword(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value={1}>1 - Faible</option>
                    <option value={2}>2 - Moyen</option>
                    <option value={3}>3 - Important</option>
                    <option value={4}>4 - Très important</option>
                    <option value={5}>5 - Critique</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingKeyword(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddKeyword}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="keywords" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keywords">Mots-clés actifs</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="keywords" className="space-y-4">
            {/* Barre de recherche */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Rechercher un mot-clé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Importer
              </Button>
            </div>

            {/* Statistiques par catégorie */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {getCategoryStats().map((stat) => (
                <div key={stat.category} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{stat.count}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Liste des mots-clés */}
            <div className="space-y-2">
              {filteredKeywords.map((keyword) => (
                <div key={keyword.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={keyword.isActive}
                        onChange={() => handleToggleKeyword(keyword.id)}
                        className="rounded"
                      />
                      <span className="font-medium">{keyword.term}</span>
                    </div>
                    <Badge className={getCategoryColor(keyword.category)}>
                      {keyword.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Poids: {keyword.weight}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-600">
                      <div>{keyword.detectionCount} détections</div>
                      {keyword.lastDetected && (
                        <div>Dernier: {keyword.lastDetected}</div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditKeyword(keyword)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteKeyword(keyword.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Mots-clés les plus détectés
                </h4>
                <div className="space-y-3">
                  {keywords
                    .sort((a, b) => b.detectionCount - a.detectionCount)
                    .slice(0, 5)
                    .map((keyword) => (
                      <div key={keyword.id} className="flex justify-between">
                        <span>{keyword.term}</span>
                        <span className="font-medium">{keyword.detectionCount}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-4">Performance par catégorie</h4>
                <div className="space-y-3">
                  {getCategoryStats().map((stat) => (
                    <div key={stat.category} className="flex justify-between">
                      <span>{stat.label}</span>
                      <span className="font-medium">{stat.count} termes actifs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-2">Suggestions automatiques</h4>
              <p className="text-sm text-blue-700 mb-4">
                Basées sur l'analyse des contenus détectés, voici des mots-clés suggérés :
              </p>
              <div className="flex flex-wrap gap-2">
                {["toux", "migraine", "vaccination", "lyon", "marseille", "ibuprofène"].map((suggestion) => (
                  <Badge key={suggestion} variant="outline" className="cursor-pointer hover:bg-blue-100">
                    + {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog d'édition */}
        <Dialog open={isEditingKeyword} onOpenChange={setIsEditingKeyword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le mot-clé</DialogTitle>
            </DialogHeader>
            {selectedKeyword && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editTerm">Terme</Label>
                  <Input
                    id="editTerm"
                    value={selectedKeyword.term}
                    onChange={(e) => setSelectedKeyword(prev => prev ? { ...prev, term: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="editCategory">Catégorie</Label>
                  <select
                    id="editCategory"
                    value={selectedKeyword.category}
                    onChange={(e) => setSelectedKeyword(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="symptome">Symptôme</option>
                    <option value="maladie">Maladie</option>
                    <option value="lieu">Lieu</option>
                    <option value="medicament">Médicament</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="editWeight">Poids</Label>
                  <select
                    id="editWeight"
                    value={selectedKeyword.weight}
                    onChange={(e) => setSelectedKeyword(prev => prev ? { ...prev, weight: parseInt(e.target.value) } : null)}
                    className="w-full p-2 border rounded"
                  >
                    <option value={1}>1 - Faible</option>
                    <option value={2}>2 - Moyen</option>
                    <option value={3}>3 - Important</option>
                    <option value={4}>4 - Très important</option>
                    <option value={5}>5 - Critique</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditingKeyword(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateKeyword}>
                    Sauvegarder
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
