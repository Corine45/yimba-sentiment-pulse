
import { supabase } from '@/integrations/supabase/client';
import type { NewUser } from '@/types/user';

export const userCreateService = {
  async addUser(newUser: NewUser): Promise<boolean> {
    console.log('Adding new user:', newUser);
    
    // Créer un utilisateur via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: 'TempPassword123!', // Password temporaire
      email_confirm: true, // Confirmer l'email automatiquement
      user_metadata: {
        name: newUser.name
      }
    });

    console.log('Auth creation result:', authData, authError);

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });

      console.log('Profile creation error:', profileError);

      if (profileError) {
        throw profileError;
      }

      // Créer le rôle utilisateur
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: authData.user.id,
          role: newUser.role 
        });

      console.log('Role creation error:', roleError);
      if (roleError) {
        console.error('Error creating user role:', roleError);
      }

      return true;
    }
    
    return false;
  }
};
