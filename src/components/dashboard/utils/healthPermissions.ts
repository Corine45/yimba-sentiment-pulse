
// Système de permissions dédié au module Veille Sanitaire
// Indépendant des rôles YIMBA existants

export type HealthRole = 
  | "admin_sante" 
  | "analyste_sanitaire" 
  | "observateur_partenaire" 
  | "formateur_accompagnateur";

export interface HealthPermissions {
  // Lecture des données
  canViewDashboard: boolean;
  canViewAlerts: boolean;
  canViewMap: boolean;
  canViewReports: boolean;
  
  // Gestion des alertes
  canCreateAlerts: boolean;
  canEditAlerts: boolean;
  canValidateAlerts: boolean;
  canDeleteAlerts: boolean;
  
  // Annotation et analyse
  canAnnotateData: boolean;
  canClassifyCases: boolean;
  canPrioritizeCases: boolean;
  canRejectAlerts: boolean;
  
  // Configuration et paramétrage
  canConfigureSources: boolean;
  canManageKeywords: boolean;
  canSetThresholds: boolean;
  canManageHealthUsers: boolean;
  
  // Export et données
  canExportData: boolean;
  canExportReports: boolean;
  canAccessRawData: boolean;
  
  // Suivi des cas
  canTrackCases: boolean;
  canCreateCaseFiles: boolean;
  canAssignCases: boolean;
  
  // Signalement
  canReportCases: boolean;
  canSubmitSignals: boolean;
  
  // Formation et accompagnement
  canAccessTraining: boolean;
  canManageTrainingContent: boolean;
  canViewUsageLogs: boolean;
  canProvideSupport: boolean;
  
  // Niveau d'accès
  accessLevel: "full" | "limited" | "readonly" | "training";
}

export const getHealthPermissions = (role: HealthRole): HealthPermissions => {
  switch (role) {
    case "admin_sante":
      return {
        // Lecture - accès complet
        canViewDashboard: true,
        canViewAlerts: true,
        canViewMap: true,
        canViewReports: true,
        
        // Gestion des alertes - accès complet
        canCreateAlerts: true,
        canEditAlerts: true,
        canValidateAlerts: true,
        canDeleteAlerts: true,
        
        // Annotation et analyse - accès complet
        canAnnotateData: true,
        canClassifyCases: true,
        canPrioritizeCases: true,
        canRejectAlerts: true,
        
        // Configuration - accès complet
        canConfigureSources: true,
        canManageKeywords: true,
        canSetThresholds: true,
        canManageHealthUsers: true,
        
        // Export - accès complet
        canExportData: true,
        canExportReports: true,
        canAccessRawData: true,
        
        // Suivi des cas - accès complet
        canTrackCases: true,
        canCreateCaseFiles: true,
        canAssignCases: true,
        
        // Signalement
        canReportCases: true,
        canSubmitSignals: true,
        
        // Formation
        canAccessTraining: true,
        canManageTrainingContent: false,
        canViewUsageLogs: false,
        canProvideSupport: false,
        
        accessLevel: "full"
      };

    case "analyste_sanitaire":
      return {
        // Lecture - accès complet sauf configuration
        canViewDashboard: true,
        canViewAlerts: true,
        canViewMap: true,
        canViewReports: true,
        
        // Gestion des alertes - lecture et modification
        canCreateAlerts: false,
        canEditAlerts: true,
        canValidateAlerts: true,
        canDeleteAlerts: false,
        
        // Annotation et analyse - accès complet
        canAnnotateData: true,
        canClassifyCases: true,
        canPrioritizeCases: true,
        canRejectAlerts: true,
        
        // Configuration - pas d'accès
        canConfigureSources: false,
        canManageKeywords: false,
        canSetThresholds: false,
        canManageHealthUsers: false,
        
        // Export - accès limité
        canExportData: true,
        canExportReports: true,
        canAccessRawData: false,
        
        // Suivi des cas - accès limité
        canTrackCases: true,
        canCreateCaseFiles: true,
        canAssignCases: false,
        
        // Signalement
        canReportCases: true,
        canSubmitSignals: true,
        
        // Formation
        canAccessTraining: true,
        canManageTrainingContent: false,
        canViewUsageLogs: false,
        canProvideSupport: false,
        
        accessLevel: "limited"
      };

    case "observateur_partenaire":
      return {
        // Lecture - alertes validées uniquement
        canViewDashboard: true,
        canViewAlerts: true,
        canViewMap: true,
        canViewReports: true,
        
        // Gestion des alertes - lecture seule
        canCreateAlerts: false,
        canEditAlerts: false,
        canValidateAlerts: false,
        canDeleteAlerts: false,
        
        // Annotation et analyse - pas d'accès
        canAnnotateData: false,
        canClassifyCases: false,
        canPrioritizeCases: false,
        canRejectAlerts: false,
        
        // Configuration - pas d'accès
        canConfigureSources: false,
        canManageKeywords: false,
        canSetThresholds: false,
        canManageHealthUsers: false,
        
        // Export - pas d'accès
        canExportData: false,
        canExportReports: false,
        canAccessRawData: false,
        
        // Suivi des cas - lecture seule
        canTrackCases: false,
        canCreateCaseFiles: false,
        canAssignCases: false,
        
        // Signalement - peut signaler uniquement
        canReportCases: true,
        canSubmitSignals: true,
        
        // Formation
        canAccessTraining: true,
        canManageTrainingContent: false,
        canViewUsageLogs: false,
        canProvideSupport: false,
        
        accessLevel: "readonly"
      };

    case "formateur_accompagnateur":
      return {
        // Lecture - pas d'accès aux données de santé
        canViewDashboard: false,
        canViewAlerts: false,
        canViewMap: false,
        canViewReports: false,
        
        // Gestion des alertes - pas d'accès
        canCreateAlerts: false,
        canEditAlerts: false,
        canValidateAlerts: false,
        canDeleteAlerts: false,
        
        // Annotation et analyse - pas d'accès
        canAnnotateData: false,
        canClassifyCases: false,
        canPrioritizeCases: false,
        canRejectAlerts: false,
        
        // Configuration - pas d'accès
        canConfigureSources: false,
        canManageKeywords: false,
        canSetThresholds: false,
        canManageHealthUsers: false,
        
        // Export - pas d'accès
        canExportData: false,
        canExportReports: false,
        canAccessRawData: false,
        
        // Suivi des cas - pas d'accès
        canTrackCases: false,
        canCreateCaseFiles: false,
        canAssignCases: false,
        
        // Signalement - pas d'accès
        canReportCases: false,
        canSubmitSignals: false,
        
        // Formation - accès complet
        canAccessTraining: true,
        canManageTrainingContent: true,
        canViewUsageLogs: true,
        canProvideSupport: true,
        
        accessLevel: "training"
      };

    default:
      // Profil par défaut - aucun accès
      return {
        canViewDashboard: false,
        canViewAlerts: false,
        canViewMap: false,
        canViewReports: false,
        canCreateAlerts: false,
        canEditAlerts: false,
        canValidateAlerts: false,
        canDeleteAlerts: false,
        canAnnotateData: false,
        canClassifyCases: false,
        canPrioritizeCases: false,
        canRejectAlerts: false,
        canConfigureSources: false,
        canManageKeywords: false,
        canSetThresholds: false,
        canManageHealthUsers: false,
        canExportData: false,
        canExportReports: false,
        canAccessRawData: false,
        canTrackCases: false,
        canCreateCaseFiles: false,
        canAssignCases: false,
        canReportCases: false,
        canSubmitSignals: false,
        canAccessTraining: false,
        canManageTrainingContent: false,
        canViewUsageLogs: false,
        canProvideSupport: false,
        accessLevel: "readonly"
      };
  }
};

export const getHealthRoleLabel = (role: HealthRole): string => {
  switch (role) {
    case "admin_sante":
      return "Administrateur Santé";
    case "analyste_sanitaire":
      return "Analyste Sanitaire";
    case "observateur_partenaire":
      return "Observateur/Partenaire";
    case "formateur_accompagnateur":
      return "Formateur/Accompagnateur";
    default:
      return role;
  }
};

export const getHealthRoleBadgeColor = (role: HealthRole): string => {
  switch (role) {
    case "admin_sante":
      return "bg-red-100 text-red-800 border-red-200";
    case "analyste_sanitaire":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "observateur_partenaire":
      return "bg-green-100 text-green-800 border-green-200";
    case "formateur_accompagnateur":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getHealthRoleDescription = (role: HealthRole): string => {
  switch (role) {
    case "admin_sante":
      return "Accès complet au module de veille sanitaire, paramétrage des sources et gestion des utilisateurs du module.";
    case "analyste_sanitaire":
      return "Analyse, annotation et validation des signaux sanitaires détectés. Export de données autorisé.";
    case "observateur_partenaire":
      return "Consultation des alertes validées et des tableaux de bord. Peut signaler des cas.";
    case "formateur_accompagnateur":
      return "Gestion de la formation et accompagnement des utilisateurs. Accès aux contenus pédagogiques.";
    default:
      return "";
  }
};
