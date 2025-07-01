
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Clock, Activity } from "lucide-react";

interface UserActivityProps {
  userRole: string;
  permissions: any;
}

export const UserActivity = ({ userRole, permissions }: UserActivityProps) => {
  const recentUsers = [
    {
      name: "Admin Principal",
      email: "admin@yimba.com",
      role: "admin",
      lastActivity: "Il y a 5 minutes",
      status: "active"
    },
    {
      name: "Analyste Santé",
      email: "analyste1@yimba.com", 
      role: "analyste",
      lastActivity: "Il y a 1 heure",
      status: "active"
    },
    {
      name: "Observateur Partenaire",
      email: "observateur1@yimba.com",
      role: "observateur", 
      lastActivity: "Il y a 3 heures",
      status: "inactive"
    }
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "analyste":
        return "bg-blue-100 text-blue-800";
      case "observateur":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Total utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">8</span>
              <p className="text-xs text-gray-500">Utilisateurs enregistrés</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">3</span>
              <p className="text-xs text-gray-500">Dernières 24h</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Session moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-2xl font-bold text-purple-600">45min</span>
              <p className="text-xs text-gray-500">Temps de session</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Activité récente des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{user.lastActivity}</p>
                  </div>
                  {getStatusBadge(user.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
