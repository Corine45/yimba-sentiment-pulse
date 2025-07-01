
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, CheckCheck } from "lucide-react";

interface NotificationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  severityFilter: string;
  setSeverityFilter: (severity: string) => void;
  readFilter: string;
  setReadFilter: (filter: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
  totalCount: number;
}

export const NotificationFilters = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  severityFilter,
  setSeverityFilter,
  readFilter,
  setReadFilter,
  onMarkAllAsRead,
  unreadCount,
  totalCount
}: NotificationFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {totalCount} notifications
            </Badge>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} non lues
              </Badge>
            )}
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="flex items-center space-x-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tout marquer comme lu</span>
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans les notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="search">Recherche</SelectItem>
            <SelectItem value="security">Sécurité</SelectItem>
            <SelectItem value="report">Rapport</SelectItem>
            <SelectItem value="health">Santé</SelectItem>
            <SelectItem value="system">Système</SelectItem>
            <SelectItem value="alert">Alerte</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Gravité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
            <SelectItem value="high">Élevée</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
          </SelectContent>
        </Select>

        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="unread">Non lues</SelectItem>
            <SelectItem value="read">Lues</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
