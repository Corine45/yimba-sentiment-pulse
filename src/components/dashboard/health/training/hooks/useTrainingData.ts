
import { useState, useEffect } from "react";
import { TrainingModule, TrainingResource, TrainingStats } from "../types/trainingTypes";
import { HealthRole } from "../../../utils/healthPermissions";

export const useTrainingData = (healthRole: HealthRole) => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation des données de formation
    const mockModules: TrainingModule[] = [
      {
        id: "intro-surveillance",
        title: "Introduction à la veille sanitaire",
        description: "Concepts de base et méthodologie de surveillance épidémiologique",
        level: "beginner",
        duration: 120,
        status: "completed",
        progress: 100,
        category: "surveillance",
        completedAt: "2024-01-15",
        certificateAvailable: true
      },
      {
        id: "signal-interpretation",
        title: "Interprétation des signaux",
        description: "Comment analyser et valider les alertes sanitaires",
        level: "intermediate",
        duration: 180,
        status: "in_progress",
        progress: 65,
        category: "analysis",
        lastAccessed: "2024-01-20"
      },
      {
        id: "crisis-management",
        title: "Gestion de crise sanitaire",
        description: "Procédures d'escalade et coordination en situation d'urgence",
        level: "advanced",
        duration: 240,
        status: "not_started",
        progress: 0,
        category: "crisis",
        requiredRole: ["admin_sante", "analyste_sanitaire"],
        certificateAvailable: true
      },
      {
        id: "platform-usage",
        title: "Utilisation de la plateforme",
        description: "Guide pratique des fonctionnalités YIMBA",
        level: "beginner",
        duration: 90,
        status: "completed",
        progress: 100,
        category: "platform",
        completedAt: "2024-01-10",
        certificateAvailable: false
      },
      {
        id: "data-analysis",
        title: "Analyse des données épidémiologiques",
        description: "Méthodes statistiques et outils d'analyse",
        level: "advanced",
        duration: 300,
        status: "not_started",
        progress: 0,
        category: "analysis",
        requiredRole: ["admin_sante", "analyste_sanitaire"],
        certificateAvailable: true
      }
    ];

    const mockResources: TrainingResource[] = [
      {
        id: "who-guide",
        title: "Guide méthodologique OMS",
        description: "Surveillance épidémiologique - Edition 2023",
        type: "pdf",
        url: "#",
        category: "Méthodologie",
        downloadCount: 156,
        lastUpdated: "2024-01-01"
      },
      {
        id: "ci-protocols",
        title: "Protocoles nationaux CI",
        description: "Procédures locales adaptées au contexte ivoirien",
        type: "pdf",
        url: "#",
        category: "Réglementation",
        downloadCount: 89,
        lastUpdated: "2023-12-15"
      },
      {
        id: "case-studies",
        title: "Études de cas - Épidémies récentes",
        description: "Analyse de cas réels et retours d'expérience",
        type: "interactive",
        url: "#",
        category: "Cas pratiques",
        downloadCount: 234,
        lastUpdated: "2024-01-10"
      }
    ];

    // Filtrer les modules selon le rôle
    const filteredModules = mockModules.filter(module => 
      !module.requiredRole || module.requiredRole.includes(healthRole)
    );

    const mockStats: TrainingStats = {
      totalModules: filteredModules.length,
      completedModules: filteredModules.filter(m => m.status === "completed").length,
      inProgressModules: filteredModules.filter(m => m.status === "in_progress").length,
      totalHours: Math.round(filteredModules.reduce((acc, m) => acc + m.duration, 0) / 60),
      completedHours: Math.round(filteredModules.filter(m => m.status === "completed").reduce((acc, m) => acc + m.duration, 0) / 60),
      certificatesEarned: filteredModules.filter(m => m.status === "completed" && m.certificateAvailable).length
    };

    setModules(filteredModules);
    setResources(mockResources);
    setStats(mockStats);
    setLoading(false);
  }, [healthRole]);

  const startModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, status: "in_progress" as const, progress: 10, lastAccessed: new Date().toISOString() }
        : module
    ));
  };

  const updateProgress = (moduleId: string, progress: number) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            progress, 
            status: progress >= 100 ? "completed" as const : "in_progress" as const,
            lastAccessed: new Date().toISOString(),
            completedAt: progress >= 100 ? new Date().toISOString() : module.completedAt
          }
        : module
    ));
  };

  return {
    modules,
    resources,
    stats,
    loading,
    startModule,
    updateProgress
  };
};
