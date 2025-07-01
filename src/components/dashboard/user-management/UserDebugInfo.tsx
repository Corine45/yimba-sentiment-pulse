
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User, UserStats } from "@/types/user";

interface UserDebugInfoProps {
  users: User[];
  stats: UserStats;
  onRefresh?: () => void;
}

export const UserDebugInfo = ({ users, stats, onRefresh }: UserDebugInfoProps) => {
  const statusBreakdown = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    emailConfirmed: users.filter(u => u.email_confirmed).length,
    emailNotConfirmed: users.filter(u => !u.email_confirmed).length,
    withRecentLogin: users.filter(u => u.last_login && new Date(u.last_login) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    withoutRecentActivity: users.filter(u => !u.last_login || new Date(u.last_login) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">Informations de debug - Statuts des utilisateurs</h4>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        )}
      </div>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>📊 <strong>Total utilisateurs:</strong> {statusBreakdown.total}</p>
        <p>✅ <strong>Utilisateurs actifs:</strong> {statusBreakdown.active} (email confirmé + activité récente)</p>
        <p>❌ <strong>Utilisateurs inactifs:</strong> {statusBreakdown.inactive}</p>
        <p>📧 <strong>Emails confirmés:</strong> {statusBreakdown.emailConfirmed}</p>
        <p>📭 <strong>Emails non confirmés:</strong> {statusBreakdown.emailNotConfirmed}</p>
        <p>🔄 <strong>Connexion récente (7j):</strong> {statusBreakdown.withRecentLogin}</p>
        <p>💤 <strong>Sans activité récente (30j):</strong> {statusBreakdown.withoutRecentActivity}</p>
        
        {statusBreakdown.emailNotConfirmed > 0 && (
          <div className="mt-2 p-2 bg-orange-100 rounded border-l-4 border-orange-400">
            <p className="text-orange-700 font-medium">
              ⚠️ {statusBreakdown.emailNotConfirmed} utilisateur(s) ont des emails non confirmés
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Utilisez les boutons "Confirmer email" ou "Renvoyer email" pour les activer
            </p>
          </div>
        )}
        
        {users.length === 0 && (
          <div className="text-red-600 font-medium space-y-1">
            <p>⚠️ Aucun utilisateur trouvé - Vérifiez les tables 'profiles' et 'user_roles' dans Supabase</p>
            <p>🔧 Vérifiez aussi que votre compte a les permissions pour voir tous les utilisateurs</p>
          </div>
        )}
      </div>
    </div>
  );
};
