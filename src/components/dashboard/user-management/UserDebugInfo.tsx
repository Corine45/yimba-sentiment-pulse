
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User, UserStats } from "@/types/user";

interface UserDebugInfoProps {
  users: User[];
  stats: UserStats;
  onRefresh?: () => void;
}

export const UserDebugInfo = ({ users, stats, onRefresh }: UserDebugInfoProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">Informations de debug</h4>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        )}
      </div>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>📊 Utilisateurs chargés depuis Supabase: <strong>{users.length}</strong></p>
        <p>📧 Emails trouvés: <strong>{users.map(u => u.email).join(', ') || 'Aucun'}</strong></p>
        <p>🔑 Rôles: {users.map(u => `${u.email} (${u.role})`).join(', ') || 'Aucun'}</p>
        <p>📈 Stats: Total: {stats.total}, Actifs: {stats.active}, Admin: {stats.admins}, Analystes: {stats.analysts}</p>
        {users.length === 0 && (
          <div className="text-red-600 font-medium space-y-1">
            <p>⚠️ Aucun utilisateur trouvé - Vérifiez les tables 'profiles' et 'user_roles' dans Supabase</p>
            <p>🔧 Vérifiez aussi que votre compte a les permissions admin pour voir tous les utilisateurs</p>
          </div>
        )}
        {users.length > 0 && users.length < 5 && (
          <p className="text-orange-600 font-medium">⚠️ Nombre d'utilisateurs faible - Certains utilisateurs pourraient manquer dans la table 'profiles'</p>
        )}
      </div>
    </div>
  );
};
