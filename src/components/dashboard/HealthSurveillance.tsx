
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthDashboard } from "./health/HealthDashboard";
import { HealthAlerts } from "./health/HealthAlerts";
import { HealthCaseTracking } from "./health/HealthCaseTracking";
import { HealthSettings } from "./health/HealthSettings";
import { Activity, AlertTriangle, FileText, Settings } from "lucide-react";

interface HealthSurveillanceProps {
  userRole: string;
  permissions: any;
}

export const HealthSurveillance = ({ userRole, permissions }: HealthSurveillanceProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const getAvailableTabs = () => {
    const tabs = [
      {
        value: "dashboard",
        label: "Tableau de bord",
        icon: Activity,
        description: "Vue d'ensemble des signaux sanitaires"
      },
      {
        value: "alerts",
        label: "Alertes",
        icon: AlertTriangle,
        description: "Gestion des alertes sanitaires"
      },
      {
        value: "cases",
        label: "Cas suivis",
        icon: FileText,
        description: "Suivi des interventions"
      }
    ];

    if (permissions.canConfigureHealthSources) {
      tabs.push({
        value: "settings",
        label: "Paramètres",
        icon: Settings,
        description: "Configuration des sources"
      });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="space-y-6">
      {/* Header du module */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Activity className="w-6 h-6 mr-3 text-green-600" />
                Module Veille Sanitaire et Suivi Pandémique
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Détection, alertes et suivi des signaux de crises sanitaires
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Surveillance active</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation des sous-modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full bg-white p-1 shadow-sm`} style={{gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`}}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2" title={tab.description}>
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <HealthDashboard userRole={userRole} permissions={permissions} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <HealthAlerts userRole={userRole} permissions={permissions} />
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <HealthCaseTracking userRole={userRole} permissions={permissions} />
        </TabsContent>

        {permissions.canConfigureHealthSources && (
          <TabsContent value="settings" className="space-y-6">
            <HealthSettings userRole={userRole} permissions={permissions} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
