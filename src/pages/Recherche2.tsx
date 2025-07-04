
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Recherche2Panel } from "@/components/dashboard/recherche2/Recherche2Panel";
import { getRolePermissions } from "@/components/dashboard/utils/dashboardUtils";

export default function Recherche2() {
  const { user } = useAuth();

  if (!user) {
    return <ProtectedRoute />;
  }

  const permissions = getRolePermissions(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recherche Avancée</h1>
          <p className="text-gray-600 mt-2">
            Surveillance et analyse des mentions via API Backend - Style Brand24
          </p>
        </div>
        
        <Recherche2Panel 
          userRole={user.role}
          permissions={permissions}
        />
      </div>
    </div>
  );
}
