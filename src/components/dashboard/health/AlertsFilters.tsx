
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface AlertsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  severityFilter: string;
  setSeverityFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const AlertsFilters = ({
  searchTerm,
  setSearchTerm,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter
}: AlertsFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recherche</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Maladie, localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Gravité</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les gravités" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gravités</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
                <SelectItem value="modéré">Modéré</SelectItem>
                <SelectItem value="faible">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="resolu">Résolu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
