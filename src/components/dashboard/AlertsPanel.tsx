
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, RefreshCw, ExternalLink } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { NotificationItem } from "./notifications/NotificationItem";
import { NotificationFilters } from "./notifications/NotificationFilters";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AlertsPanelProps {
  userRole: string;
  permissions: any;
}

export const AlertsPanel = ({ userRole, permissions }: AlertsPanelProps) => {
  const { notifications, loading, unreadCount, refetch, markAsRead, markAllAsRead } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesSeverity = severityFilter === "all" || notification.severity === severityFilter;
    const matchesRead = readFilter === "all" || 
                       (readFilter === "read" && notification.read) ||
                       (readFilter === "unread" && !notification.read);

    return matchesSearch && matchesType && matchesSeverity && matchesRead;
  });

  const handleViewSource = (notification: Notification) => {
    // Naviguer vers la source appropriée selon le type de notification
    switch (notification.type) {
      case 'search':
        navigate('/dashboard?tab=search');
        break;
      case 'report':
        navigate('/dashboard?tab=analysis');
        break;
      case 'security':
        if (userRole === 'admin') {
          navigate('/status');
        }
        break;
      case 'health':
        if (permissions.canAccessHealthSurveillance) {
          navigate('/dashboard?tab=health');
        }
        break;
      case 'system':
        if (userRole === 'admin') {
          navigate('/status');
        }
        break;
      default:
        break;
    }
    
    toast({
      title: "Redirection",
      description: `Redirection vers la source: ${notification.source}`,
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualisation",
      description: "Notifications mises à jour",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {permissions.canManageAlerts ? 
                    "Gestion complète des alertes et notifications" : 
                    "Réception et consultation des notifications"
                  }
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <NotificationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            readFilter={readFilter}
            setReadFilter={setReadFilter}
            onMarkAllAsRead={markAllAsRead}
            unreadCount={unreadCount}
            totalCount={notifications.length}
          />
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onViewSource={handleViewSource}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-2">
                {searchTerm || typeFilter !== "all" || severityFilter !== "all" || readFilter !== "all" 
                  ? "Aucune notification trouvée" 
                  : "Aucune notification"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm || typeFilter !== "all" || severityFilter !== "all" || readFilter !== "all"
                  ? "Essayez de modifier vos filtres pour voir plus de notifications."
                  : "Les notifications apparaîtront ici dès qu'il y aura de l'activité sur votre compte."}
              </p>
              {(searchTerm || typeFilter !== "all" || severityFilter !== "all" || readFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setSeverityFilter("all");
                    setReadFilter("all");
                  }}
                  className="mt-3"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informations sur les permissions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-blue-100 rounded">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Notifications selon votre rôle : {userRole}
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {permissions.canSearch && <li>• Notifications de recherche et résultats</li>}
                {permissions.canAnalyze && <li>• Alertes d'analyse de sentiment</li>}
                {permissions.canGenerateReports && <li>• Notifications de génération de rapports</li>}
                {permissions.canAccessHealthSurveillance && <li>• Alertes de veille sanitaire</li>}
                {userRole === 'admin' && <li>• Événements de sécurité et système</li>}
                <li>• Notifications en temps réel avec actualisation automatique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
