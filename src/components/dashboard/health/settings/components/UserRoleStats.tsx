
import { HealthRole, getHealthRoleLabel } from "../../../utils/healthPermissions";
import { HealthUser } from "../types/healthUser";

interface UserRoleStatsProps {
  users: HealthUser[];
}

export const UserRoleStats = ({ users }: UserRoleStatsProps) => {
  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<HealthRole, number>);
    
    return [
      { role: "admin_sante", count: stats.admin_sante || 0, color: "bg-red-50 text-red-600" },
      { role: "analyste_sanitaire", count: stats.analyste_sanitaire || 0, color: "bg-blue-50 text-blue-600" },
      { role: "observateur_partenaire", count: stats.observateur_partenaire || 0, color: "bg-green-50 text-green-600" },
      { role: "formateur_accompagnateur", count: stats.formateur_accompagnateur || 0, color: "bg-purple-50 text-purple-600" }
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {getRoleStats().map((stat) => (
        <div key={stat.role} className={`text-center p-3 rounded-lg ${stat.color}`}>
          <div className="text-xl font-bold">{stat.count}</div>
          <div className="text-sm">{getHealthRoleLabel(stat.role as HealthRole)}</div>
        </div>
      ))}
    </div>
  );
};
