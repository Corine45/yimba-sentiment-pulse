
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, Filter, Plus, TrendingUp, TrendingDown, Equal } from "lucide-react";

interface SubjectData {
  id: string;
  subject: string;
  category: string;
  alertsCount: number;
  severity: "critique" | "modéré" | "faible";
  trend: "up" | "down" | "stable";
  verifiedCases: number;
  locations: string[];
  sources: string[];
  lastUpdate: string;
  riskLevel: number; // 1-10
  description: string;
}

interface ComparativeTableProps {
  canExport?: boolean;
}

export const ComparativeTable = ({ canExport = true }: ComparativeTableProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées de sujets pour comparaison
  const subjects: SubjectData[] = [
    {
      id: "SUB001",
      subject: "COVID-19",
      category: "Maladies respiratoires",
      alertsCount: 45,
      severity: "modéré",
      trend: "down",
      verifiedCases: 38,
      locations: ["Abidjan", "Bouaké", "San Pedro"],
      sources: ["Twitter", "Facebook", "WhatsApp"],
      lastUpdate: "2024-01-15 16:30",
      riskLevel: 6,
      description: "Surveillance continue des variants et symptômes respiratoires"
    },
    {
      id: "SUB002",
      subject: "Paludisme",
      category: "Maladies vectorielles",
      alertsCount: 78,
      severity: "critique",
      trend: "up",
      verifiedCases: 65,
      locations: ["Bouaké", "Korhogo", "Yamoussoukro"],
      sources: ["Centres de santé", "Twitter", "Facebook"],
      lastUpdate: "2024-01-15 18:45",
      riskLevel: 8,
      description: "Augmentation significative des cas en saison des pluies"
    },
    {
      id: "SUB003",
      subject: "Dengue",
      category: "Maladies vectorielles",
      alertsCount: 23,
      severity: "faible",
      trend: "stable",
      verifiedCases: 18,
      locations: ["San Pedro", "Sassandra"],
      sources: ["WhatsApp", "Centres de santé"],
      lastUpdate: "2024-01-15 14:20",
      riskLevel: 4,
      description: "Cas sporadiques dans les zones portuaires"
    },
    {
      id: "SUB004",
      subject: "Méningite",
      category: "Maladies neurologiques",
      alertsCount: 12,
      severity: "modéré",
      trend: "up",
      verifiedCases: 10,
      locations: ["Korhogo", "Ferkessédougou"],
      sources: ["Centres de santé", "Twitter"],
      lastUpdate: "2024-01-15 12:15",
      riskLevel: 7,
      description: "Surveillance renforcée en saison sèche"
    },
    {
      id: "SUB005",
      subject: "Choléra",
      category: "Maladies hydriques",
      alertsCount: 6,
      severity: "faible",
      trend: "stable",
      verifiedCases: 4,
      locations: ["Abidjan"],
      sources: ["Facebook", "WhatsApp"],
      lastUpdate: "2024-01-15 10:30",
      riskLevel: 3,
      description: "Cas isolés liés à l'assainissement"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return 'bg-red-100 text-red-800';
      case 'modéré': return 'bg-yellow-100 text-yellow-800';
      case 'faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'stable': return <Equal className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 8) return 'text-red-600 font-bold';
    if (riskLevel >= 6) return 'text-yellow-600 font-semibold';
    if (riskLevel >= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesCategory = filterCategory === "all" || subject.category === filterCategory;
    const matchesSearch = subject.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const getSelectedSubjectsData = () => {
    return subjects.filter(subject => selectedSubjects.includes(subject.id));
  };

  const categories = [...new Set(subjects.map(s => s.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Tableau Comparatif des Sujets Sanitaires
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Sélectionnez les sujets à comparer pour votre étude comparative
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {canExport && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              )}
              <Badge variant="outline">
                {selectedSubjects.length} sujets sélectionnés
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <Input
                placeholder="Rechercher un sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedSubjects(filteredSubjects.map(s => s.id))}
              >
                <Plus className="w-4 h-4 mr-2" />
                Sélectionner tout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau de sélection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Sélection des sujets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sélection</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Alertes</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Tendance</TableHead>
                <TableHead>Risque</TableHead>
                <TableHead>Dernière MAJ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id} className={selectedSubjects.includes(subject.id) ? "bg-blue-50" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => toggleSubjectSelection(subject.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{subject.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subject.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-semibold">{subject.alertsCount}</span>
                      <div className="text-xs text-gray-500">({subject.verifiedCases} vérifiées)</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(subject.severity)}>
                      {subject.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getTrendIcon(subject.trend)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${getRiskColor(subject.riskLevel)}`}>
                      {subject.riskLevel}/10
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {subject.lastUpdate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tableau comparatif */}
      {selectedSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Critères</TableHead>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableHead key={subject.id} className="text-center font-bold">
                        {subject.subject}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Catégorie</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        <Badge variant="outline">{subject.category}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nombre d'alertes</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center font-semibold">
                        {subject.alertsCount}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cas vérifiés</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center font-semibold">
                        {subject.verifiedCases}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Niveau de risque</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        <span className={`font-bold ${getRiskColor(subject.riskLevel)}`}>
                          {subject.riskLevel}/10
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gravité</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        <Badge className={getSeverityColor(subject.severity)}>
                          {subject.severity}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tendance</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        <div className="flex justify-center">
                          {getTrendIcon(subject.trend)}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Zones affectées</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        <div className="space-y-1">
                          {subject.locations.map((location, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sources de données</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        <div className="space-y-1">
                          {subject.sources.map((source, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Description</TableCell>
                    {getSelectedSubjectsData().map((subject) => (
                      <TableCell key={subject.id} className="text-center text-sm">
                        {subject.description}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSubjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sujet sélectionné</h3>
            <p className="text-gray-600">
              Sélectionnez au moins un sujet dans le tableau ci-dessus pour commencer la comparaison.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
