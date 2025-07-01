
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useSecurityEvents } from "@/hooks/useSecurityEvents";

interface SecurityOverviewProps {
  userRole: string;
  permissions: any;
}

export const SecurityOverview = ({ userRole, permissions }: SecurityOverviewProps) => {
  const { securityData, loading, refetch } = useSecurityEvents();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
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
      {/* Header avec bouton de rafraîchissement */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Aperçu sécurité</h2>
        <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Score de sécurité global */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Score de sécurité global
            </div>
            <div className="text-3xl font-bold text-green-600">
              {securityData.securityScore}%
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Basé sur {securityData.securityChecks.length} contrôles de sécurité automatisés
          </p>
        </CardContent>
      </Card>

      {/* Contrôles de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Contrôles de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityData.securityChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    {check.name.includes('Authentification') && <Lock className="w-5 h-5 text-gray-600" />}
                    {check.name.includes('Chiffrement') && <Shield className="w-5 h-5 text-gray-600" />}
                    {check.name.includes('rôles') && <Key className="w-5 h-5 text-gray-600" />}
                    {check.name.includes('Monitoring') && <AlertTriangle className="w-5 h-5 text-gray-600" />}
                    <div>
                      <h4 className="font-medium text-gray-900">{check.name}</h4>
                      <p className="text-sm text-gray-600">{check.description}</p>
                      <p className="text-xs text-gray-500">Dernière vérification: {check.lastCheck}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  {getStatusIcon(check.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Événements de sécurité récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
              Événements de sécurité récents
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {securityData.totalEvents} événements
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityData.recentEvents.length > 0 ? (
              securityData.recentEvents.map((event, index) => (
                <div key={event.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-600">
                      {event.user} • {event.timestamp}
                    </p>
                  </div>
                  {getEventBadge(event.status)}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun événement de sécurité récent</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
