
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Users, BarChart, Settings, Library, Award } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { useTrainingData } from "./training/hooks/useTrainingData";
import { TrainingStats } from "./training/components/TrainingStats";
import { TrainingModuleCard } from "./training/components/TrainingModuleCard";
import { ResourcesList } from "./training/components/ResourcesList";

interface HealthTrainingProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthTraining = ({ healthRole, healthPermissions }: HealthTrainingProps) => {
  const { modules, resources, stats, loading, startModule, updateProgress } = useTrainingData(healthRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des formations...</p>
        </div>
      </div>
    );
  }

  // Vue formateur/accompagnateur (gestion)
  if (healthPermissions.canManageTrainingContent) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Centre de formation - Gestion</h2>
            <p className="text-gray-600">Gestion des contenus pédagogiques et suivi des utilisateurs</p>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Contenus</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart className="w-4 h-4" />
              <span>Statistiques</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gestion des modules de formation</span>
                  <Button>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Nouveau module
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => (
                    <div key={module.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{module.title}</h4>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{module.level}</Badge>
                        <Badge variant="outline">{module.category}</Badge>
                        <span className="text-xs text-gray-500">{module.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs d'utilisation anonymes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-blue-800">Utilisateurs actifs</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-green-800">Taux de completion</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-purple-800">Modules actifs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accompagnement des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <h3 className="font-medium text-orange-900 mb-2">Support aux utilisateurs</h3>
                    <p className="text-sm text-orange-700">Assistance technique et pédagogique pour les apprenants.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des formations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <h3 className="font-medium text-purple-900 mb-2">Gestion des certifications</h3>
                    <p className="text-sm text-purple-700">Configuration des parcours et critères de certification.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Vue utilisateur standard
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centre de formation</h2>
          <p className="text-gray-600">Formations et ressources pour la veille sanitaire</p>
        </div>
        <Badge variant="outline" className="text-purple-600">
          {healthRole === "admin_sante" ? "Niveau Expert" : 
           healthRole === "analyste_sanitaire" ? "Niveau Avancé" : "Niveau Débutant"}
        </Badge>
      </div>

      {stats && <TrainingStats stats={stats} />}

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Mes formations</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center space-x-2">
            <Library className="w-4 h-4" />
            <span>Ressources</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Certificats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                Modules de formation disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <TrainingModuleCard
                    key={module.id}
                    module={module}
                    onStart={startModule}
                    onContinue={startModule}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <ResourcesList resources={resources} />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Mes certificats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules
                  .filter(module => module.status === "completed" && module.certificateAvailable)
                  .map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h4 className="font-medium text-yellow-900">{module.title}</h4>
                          <p className="text-sm text-yellow-700">
                            Obtenu le {module.completedAt ? new Date(module.completedAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600">
                        Télécharger
                      </Button>
                    </div>
                  ))}
                
                {modules.filter(module => module.status === "completed" && module.certificateAvailable).length === 0 && (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun certificat</h3>
                    <p className="text-gray-600">Terminez vos formations pour obtenir des certificats.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
