
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserActivityData {
  totalUsers: number;
  activeUsers: number;
  averageSessionTime: string;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    lastActivity: string;
    status: 'active' | 'inactive';
  }>;
  usersByRole: {
    admin: number;
    analyste: number;
    observateur: number;
  };
}

export const useUserActivity = () => {
  const [userActivity, setUserActivity] = useState<UserActivityData>({
    totalUsers: 0,
    activeUsers: 0,
    averageSessionTime: '0min',
    recentUsers: [],
    usersByRole: {
      admin: 0,
      analyste: 0,
      observateur: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserActivity = async () => {
    if (!user) return;
    
    try {
      // Récupérer tous les profils utilisateurs
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email, role, updated_at, created_at')
        .order('updated_at', { ascending: false });

      // Récupérer les sessions utilisateurs actives
      const { data: activeSessions } = await supabase
        .from('user_sessions')
        .select('user_id, session_start, session_end, duration_minutes, is_active')
        .eq('is_active', true);

      // Récupérer toutes les sessions pour calculer la durée moyenne
      const { data: allSessions } = await supabase
        .from('user_sessions')
        .select('duration_minutes')
        .not('duration_minutes', 'is', null);

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Calculer les utilisateurs actifs
      const activeUserIds = new Set(activeSessions?.map(s => s.user_id) || []);
      const activeUsers = activeUserIds.size;

      // Compter les utilisateurs par rôle
      const roleCount = {
        admin: 0,
        analyste: 0,
        observateur: 0
      };

      profiles?.forEach(profile => {
        if (profile.role === 'admin') roleCount.admin++;
        else if (profile.role === 'analyste') roleCount.analyste++;
        else if (profile.role === 'observateur') roleCount.observateur++;
      });

      // Préparer les données des utilisateurs récents
      const recentUsers = profiles?.slice(0, 5).map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        lastActivity: getRelativeTime(new Date(profile.updated_at || profile.created_at)),
        status: activeUserIds.has(profile.id) ? 'active' as const : 'inactive' as const
      })) || [];

      // Calculer le temps de session moyen réel
      const averageSessionMinutes = allSessions?.length 
        ? Math.round(allSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / allSessions.length)
        : 0;

      setUserActivity({
        totalUsers: profiles?.length || 0,
        activeUsers,
        averageSessionTime: `${averageSessionMinutes}min`,
        recentUsers,
        usersByRole: roleCount
      });

    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  useEffect(() => {
    fetchUserActivity();
    
    // Actualiser les données toutes les 2 minutes
    const interval = setInterval(fetchUserActivity, 120000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    userActivity,
    loading,
    refetch: fetchUserActivity
  };
};
