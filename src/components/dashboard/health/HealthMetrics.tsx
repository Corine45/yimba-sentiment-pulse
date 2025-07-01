
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";

export const HealthMetrics = () => {
  const { alerts, cases, loading } = useHealthSurveillanceData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculer les métriques réelles
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critique').length;
  const activeCases = cases.filter(c => c.status !== 'resolu').length;
  const verifiedAlerts = alerts.filter(alert => alert.verified).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAlerts}</div>
          <p className="text-xs text-muted-foreground">
            {criticalAlerts} critiques
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cas en cours</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCases}</div>
          <p className="text-xs text-muted-foreground">
            En suivi actif
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertes vérifiées</CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedAlerts}</div>
          <p className="text-xs text-muted-foreground">
            Confirmées par experts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tendance</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAlerts > 0 ? '+' + totalAlerts : '0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Nouvelles détections
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
