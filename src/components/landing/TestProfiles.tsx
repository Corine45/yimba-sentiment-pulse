
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Settings, TrendingUp, Eye } from "lucide-react";

interface TestProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface TestProfilesProps {
  onQuickLogin: (profile: TestProfile) => void;
}

export const TestProfiles = ({ onQuickLogin }: TestProfilesProps) => {
  const testProfiles: TestProfile[] = [
    {
      id: "admin",
      name: "Marie Dupont",
      email: "admin@yimba.com",
      password: "admin123",
      role: "admin",
      icon: Settings,
      color: "bg-red-100 text-red-800",
      description: "Accès complet - Gestion utilisateurs, paramètres, veille sanitaire"
    },
    {
      id: "analyste",
      name: "Jean Martin",
      email: "analyste@yimba.com",
      password: "analyste123",
      role: "analyste",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-800",
      description: "Recherches avancées, rapports, analyses complètes"
    },
    {
      id: "observateur",
      name: "Sophie Laurent",
      email: "observateur@yimba.com",
      password: "observateur123",
      role: "observateur",
      icon: Eye,
      color: "bg-gray-100 text-gray-800",
      description: "Consultation uniquement, recherches simples"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Users className="w-5 h-5 mr-2" />
          Profils de test
        </CardTitle>
        <p className="text-sm text-gray-600">
          Cliquez sur un profil pour vous connecter directement
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {testProfiles.map((profile) => {
          const IconComponent = profile.icon;
          return (
            <div key={profile.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profile.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{profile.name}</h4>
                    <p className="text-sm text-gray-600">{profile.role}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onQuickLogin(profile)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <User className="w-4 h-4 mr-1" />
                  Tester
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">{profile.description}</p>
              <div className="mt-2 text-xs text-gray-400">
                <div>📧 {profile.email}</div>
                <div>🔑 {profile.password}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
