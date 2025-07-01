
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/user';

export const userUpdateService = {
  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    console.log('Updating user:', userId, updates);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    console.log('Profile update error:', error);

    if (error) {
      throw error;
    }

    // Mettre à jour aussi les rôles utilisateur si le rôle a changé
    if (updates.role) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId,
          role: updates.role 
        });

      console.log('Role update error:', roleError);
      if (roleError) {
        console.error('Error updating user role:', roleError);
      }
    }
  }
};
