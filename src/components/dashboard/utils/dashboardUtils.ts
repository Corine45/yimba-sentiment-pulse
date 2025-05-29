
// Utility functions for dashboard role management

export const getRolePermissions = (role: string) => {
  switch (role) {
    case "admin":
      return {
        canSearch: true,
        canAnalyze: true,
        canManageAlerts: true,
        canGenerateReports: true,
        canManageUsers: true,
        canAccessSettings: true,
        canExportData: true,
        canAccessHealthSurveillance: true,
        canConfigureHealthSources: true,
        searchLevel: "advanced" as const,
      };
    case "analyste":
      return {
        canSearch: true,
        canAnalyze: true,
        canManageAlerts: true,
        canGenerateReports: true,
        canManageUsers: false,
        canAccessSettings: false,
        canExportData: true,
        canAccessHealthSurveillance: true,
        canConfigureHealthSources: false,
        searchLevel: "advanced" as const,
      };
    case "observateur":
      return {
        canSearch: true,
        canAnalyze: false,
        canManageAlerts: false,
        canGenerateReports: false,
        canManageUsers: false,
        canAccessSettings: false,
        canExportData: false,
        canAccessHealthSurveillance: true,
        canConfigureHealthSources: false,
        searchLevel: "basic" as const,
      };
    default:
      return {
        canSearch: false,
        canAnalyze: false,
        canManageAlerts: false,
        canGenerateReports: false,
        canManageUsers: false,
        canAccessSettings: false,
        canExportData: false,
        canAccessHealthSurveillance: false,
        canConfigureHealthSources: false,
        searchLevel: "none" as const,
      };
  }
};

export const getRoleBadgeColor = (role: string) => {
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

export const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrateur";
    case "analyste":
      return "Analyste";
    case "observateur":
      return "Observateur";
    default:
      return role;
  }
};
