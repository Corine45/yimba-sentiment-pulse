
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, AlertTriangle, CheckCircle } from "lucide-react";

interface SecurityOverviewProps {
  userRole: string;
  permissions: any;
}

export const SecurityOverview = ({ userRole, permissions }: SecurityOverviewProps) => {
  const securityChecks = [
    {
      name: "Authentification Supabase",
      status: "secure",
      description: "JWT tokens et RLS activés",
      icon: Lock
    },
    {
      name: "Chiffrement des données",
      status: "secure", 
      description: "SSL/TLS en transit",
      icon: Shield
    },
    {
      name: "Gestion des rôles",
      status: "secure",
      description: "RLS et permissions configurées",
      icon: Key
    },
    {
      name: "Monitoring sécurité",
      status: "active",
      description: "Logs d'authentification actifs",
      icon: AlertTriangle
    }
  ];

  const recentSecurityEvents = [
    {
      event: "Connexion admin",
      user: "admin@yimba.com",
      timestamp: "Il y a 10 minutes",
      status: "success"
    },
    {
      event: "Tentative connexion échouée",
      user: "unknown@test.com", 
      timestamp: "Il y a 2 heures",
      status: "warning"
    },
    {
      event: "Changement de rôle",
      user: "observateur1@yimba.com",
      timestamp: "Il y a 1 jour",
      status: "info"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "active":
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getEventBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
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
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <check.icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{check.name}</h4>
                    <p className="text-sm text-gray-600">{check.description}</p>
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
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
            Événements de sécurité récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSecurityEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.event}</p>
                  <p className="text-sm text-gray-600">
                    {event.user} • {event.timestamp}
                  </p>
                </div>
                {getEventBadge(event.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
