
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchPanel } from "../SearchPanel";
import { SentimentAnalysis } from "../SentimentAnalysis";
import { AlertsPanel } from "../AlertsPanel";
import { ReportsPanel } from "../ReportsPanel";
import { UserManagement } from "../UserManagement";
import { HealthSurveillance } from "../health/HealthSurveillance";
import { HealthRole } from "../utils/healthPermissions";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  user: any;
  permissions: any;
}

export const DashboardTabs = ({ activeTab, onTabChange, user, permissions }: DashboardTabsProps) => {
  // Simuler un profil utilisateur pour le module santé
  // En production, ceci devrait venir de la base de données
  const healthUserProfile = {
    name: user.name,
    email: user.email || `${user.name.toLowerCase().replace(' ', '.')}@example.com`,
    healthRole: "admin_sante" as HealthRole // Par défaut, ajuster selon la logique métier
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        {permissions.canSearch && (
          <TabsContent value="search" className="space-y-6">
            <SearchPanel userRole={user.role} permissions={permissions} />
          </TabsContent>
        )}

        <TabsContent value="analysis" className="space-y-6">
          <SentimentAnalysis />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsPanel />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsPanel userRole={user.role} permissions={permissions} />
        </TabsContent>

        {permissions.canAccessHealthSurveillance && (
          <TabsContent value="health" className="space-y-6">
            <HealthSurveillance />
          </TabsContent>
        )}

        {permissions.canManageUsers && (
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        )}

        {permissions.canAccessSettings && (
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres administrateur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="font-medium text-blue-900 mb-2">Configuration de la plateforme</h3>
                    <p className="text-sm text-blue-700">Gestion des paramètres généraux, des intégrations API et des politiques de sécurité.</p>
                  </div>
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <h3 className="font-medium text-green-900 mb-2">Monitoring système</h3>
                    <p className="text-sm text-green-700">Surveillance des performances, logs système et métriques d'utilisation.</p>
                  </div>
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <h3 className="font-medium text-yellow-900 mb-2">Sauvegardes et sécurité</h3>
                    <p className="text-sm text-yellow-700">Gestion des sauvegardes automatiques et des politiques de sécurité.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
