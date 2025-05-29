
import { HealthRole } from "../../../utils/healthPermissions";

export interface HealthUser {
  id: string;
  name: string;
  email: string;
  role: HealthRole;
  lastLogin?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export interface NewUserForm {
  name: string;
  email: string;
  role: HealthRole;
}
