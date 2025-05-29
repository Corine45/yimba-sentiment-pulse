
import { HealthRole } from "../../../utils/healthPermissions";

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  duration: number; // en minutes
  status: "not_started" | "in_progress" | "completed";
  progress: number; // pourcentage 0-100
  category: "surveillance" | "analysis" | "crisis" | "platform" | "methodology";
  requiredRole?: HealthRole[];
  lastAccessed?: string;
  completedAt?: string;
  certificateAvailable: boolean;
}

export interface TrainingResource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "interactive" | "external_link";
  url: string;
  category: string;
  downloadCount: number;
  lastUpdated: string;
}

export interface TrainingStats {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalHours: number;
  completedHours: number;
  certificatesEarned: number;
}
