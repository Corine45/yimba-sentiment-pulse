
import { supabase } from '@/integrations/supabase/client';

export const userActivationService = {
  async activateUser(userId: string): Promise<void> {
    // Créer une session active pour l'utilisateur
    const { error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        session_start: new Date().toISOString(),
        is_active: true
      });

    if (error) {
      throw error;
    }
  }
};
