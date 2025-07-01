
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";

interface PlatformStatusProps {
  userRole: string;
  permissions: any;
}

export const PlatformStatus = ({ userRole, permissions }: PlatformStatusProps) => {
  const services = [
    {
      name: "Base de données",
      status: "operational",
      description: "Supabase PostgreSQL",
      visible: true
    },
    {
      name: "Authentification",
      status: "operational", 
      description: "Supabase Auth",
      visible: true
    },
    {
      name: "API de recherche",
      status: "operational",
      description: "Intégrations actives",
      visible: permissions.canSearch
    },
    {
      name: "Système d'alertes",
      status: "operational",
      description: "Notifications en temps réel",
      visible: true
    },
    {
      name: "Module santé",
      status: "operational",
      description: "Surveillance sanitaire",
      visible: permissions.canAccessHealthSurveillance
    },
    {
      name: "Génération de rapports",
      status: "operational",
      description: "Export et analyse",
      visible: permissions.canGenerateReports || permissions.canAnalyze
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Dégradé</Badge>;
      case "outage":
        return <Badge className="bg-red-100 text-red-800">Indisponible</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  const visibleServices = services.filter(service => service.visible);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          État des services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
              {getStatusBadge(service.status)}
            </div>
          ))}
        </div>

        {userRole === "observateur" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Certains services peuvent ne pas être visibles selon vos permissions d'accès.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
