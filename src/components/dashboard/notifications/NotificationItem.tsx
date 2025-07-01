
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Search, Shield, FileText, Activity, BarChart3, CheckCircle } from "lucide-react";
import { Notification } from "@/hooks/useNotifications";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onViewSource?: (notification: Notification) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead, onViewSource }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'search':
        return <Search className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'report':
        return <FileText className="w-4 h-4" />;
      case 'health':
        return <Activity className="w-4 h-4" />;
      case 'system':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = () => {
    switch (notification.severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = () => {
    switch (notification.severity) {
      case 'critical':
        return 'Critique';
      case 'high':
        return 'Élevé';
      case 'medium':
        return 'Moyen';
      case 'low':
        return 'Faible';
      default:
        return 'Normal';
    }
  };

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'search':
        return 'Recherche';
      case 'security':
        return 'Sécurité';
      case 'report':
        return 'Rapport';
      case 'health':
        return 'Santé';
      case 'system':
        return 'Système';
      default:
        return 'Alerte';
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes}min`;
    } else if (diffInMinutes < 1440) {
      return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${
              notification.severity === 'critical' ? 'bg-red-100 text-red-600' :
              notification.severity === 'high' ? 'bg-orange-100 text-orange-600' :
              notification.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Badge variant="outline" className={getSeverityColor()}>
                  {getSeverityLabel()}
                </Badge>
                <Badge variant="outline">
                  {getTypeLabel()}
                </Badge>
                <span>•</span>
                <span>{notification.source}</span>
                <span>•</span>
                <span>{formatTime(notification.timestamp)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {onViewSource && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewSource(notification)}
                className="text-xs"
              >
                Voir la source
              </Button>
            )}
            
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Marquer lu
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
