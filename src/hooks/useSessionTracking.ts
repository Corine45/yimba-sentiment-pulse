import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useSessionTracking = () => {
  const { user } = useAuth();
  const sessionId = useRef<string | null>(null);
  const lastActivity = useRef<Date>(new Date());

  const startSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions_tracking')
        .insert({
          user_id: user.id,
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
          is_active: true,
          last_activity: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      sessionId.current = data.id;
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const updateActivity = async () => {
    if (!sessionId.current || !user) return;

    try {
      const now = new Date();
      // Ne mettre à jour que si la dernière activité date de plus de 30 secondes
      if (now.getTime() - lastActivity.current.getTime() < 30000) return;

      await supabase
        .from('user_sessions_tracking')
        .update({
          last_activity: now.toISOString(),
          is_active: true
        })
        .eq('id', sessionId.current);

      lastActivity.current = now;
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const endSession = async () => {
    if (!sessionId.current || !user) return;

    try {
      await supabase
        .from('user_sessions_tracking')
        .update({
          session_end: new Date().toISOString(),
          is_active: false
        })
        .eq('id', sessionId.current);

      sessionId.current = null;
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const getClientIP = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      // Délai pour éviter les conflits avec l'authentification lors du rechargement
      const timer = setTimeout(() => {
        startSession();
      }, 1000);

      // Surveiller l'activité utilisateur
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const handleActivity = () => updateActivity();

      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Mettre à jour périodiquement
      const interval = setInterval(updateActivity, 60000); // Toutes les minutes

      // Gérer la fermeture de l'onglet/fenêtre (sans endSession qui peut causer des problèmes)
      const handleBeforeUnload = () => {
        // Ne pas appeler endSession ici car ça peut causer des déconnexions
        console.log('Page unload - session tracking stopped');
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearTimeout(timer);
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        // Ne pas appeler endSession dans le cleanup non plus
      };
    }
  }, [user]);

  return {
    updateActivity,
    endSession
  };
};