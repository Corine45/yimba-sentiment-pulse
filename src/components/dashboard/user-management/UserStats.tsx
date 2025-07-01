
import { Card, CardContent } from "@/components/ui/card";
import type { UserStats as UserStatsType } from "@/types/user";

interface UserStatsProps {
  stats: UserStatsType;
}

export const UserStats = ({ stats }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Utilisateurs totaux</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-green-800">Actifs</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
          <div className="text-sm text-red-800">Admin</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-600">{stats.analysts}</div>
          <div className="text-sm text-blue-800">Analystes</div>
        </CardContent>
      </Card>
    </div>
  );
};
