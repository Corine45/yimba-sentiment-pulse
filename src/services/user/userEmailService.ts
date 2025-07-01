
import { supabase } from '@/integrations/supabase/client';

export const userEmailService = {
  async confirmUserEmail(userId: string): Promise<void> {
    console.log('✅ Confirmation de l\'email pour l\'utilisateur:', userId);
    
    try {
      // Utiliser l'API Admin pour confirmer l'email
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true
      });

      if (error) {
        throw error;
      }
      
      console.log('✅ Email confirmé avec succès pour:', userId);
    } catch (error) {
      console.error('❌ Erreur lors de la confirmation d\'email:', error);
      throw error;
    }
  },

  async resendConfirmationEmail(email: string): Promise<void> {
    console.log('📧 Renvoi de l\'email de confirmation pour:', email);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        throw error;
      }
      
      console.log('📧 Email de confirmation renvoyé avec succès pour:', email);
    } catch (error) {
      console.error('❌ Erreur lors du renvoi de l\'email:', error);
      throw error;
    }
  }
};
