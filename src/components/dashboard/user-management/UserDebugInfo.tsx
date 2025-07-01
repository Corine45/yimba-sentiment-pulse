
import { AlertTriangle } from "lucide-react";
import type { User, UserStats } from "@/types/user";

interface UserDebugInfoProps {
  users: User[];
  stats: UserStats;
}

export const UserDebugInfo = ({ users, stats }: UserDebugInfoProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <h4 className="font-medium text-yellow-800">Informations de debug</h4>
      </div>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>📊 Utilisateurs chargés depuis Supabase: <strong>{users.length}</strong></p>
        <p>📧 Emails trouvés: <strong>{users.map(u => u.email).join(', ') || 'Aucun'}</strong></p>
        <p>🔑 Rôles: {users.map(u => `${u.email} (${u.role})`).join(', ') || 'Aucun'}</p>
        <p>📈 Stats: Total: {stats.total}, Actifs: {stats.active}, Admin: {stats.admins}, Analystes: {stats.analysts}</p>
        {users.length === 0 && (
          <p className="text-red-600 font-medium">⚠️ Aucun utilisateur trouvé - Vérifiez les tables 'profiles' et 'user_roles' dans Supabase</p>
        )}
        {users.length > 0 && users.length < 5 && (
          <p className="text-orange-600 font-medium">⚠️ Nombre d'utilisateurs faible - Certains utilisateurs pourraient manquer dans la table 'profiles'</p>
        )}
      </div>
    </div>
  );
};
