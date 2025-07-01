
import { supabase } from '@/integrations/supabase/client';

export const userDeleteService = {
  async deleteUser(userId: string): Promise<void> {
    console.log('Deleting user:', userId);
    
    // Supprimer d'abord les données liées
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('user_sessions').delete().eq('user_id', userId);
    
    // Puis supprimer le profil
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    console.log('Profile delete error:', error);

    if (error) {
      throw error;
    }

    // Optionnel : supprimer aussi de auth.users (nécessite permissions admin)
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (authError) {
      console.warn('Could not delete from auth.users:', authError);
    }
  }
};
