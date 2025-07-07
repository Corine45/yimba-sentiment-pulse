
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyste' | 'observateur';
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id || !user?.email) {
      console.log('❌ Pas d\'utilisateur pour fetchProfile');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Recherche profil pour:', { id: user.id, email: user.email });
      
      // D'abord essayer par ID
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Erreur recherche par ID:', error);
      }

      // Si pas trouvé par ID, essayer par email
      if (!data && user.email) {
        console.log('🔍 Recherche par email...');
        const { data: dataByEmail, error: errorByEmail } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (errorByEmail) {
          console.error('❌ Erreur recherche par email:', errorByEmail);
        } else if (dataByEmail) {
          console.log('✅ Profil trouvé par email:', dataByEmail);
          data = dataByEmail;
        }
      }

      if (data) {
        console.log('✅ Profil chargé:', data);
        setProfile(data);
      } else {
        console.log('❌ Aucun profil trouvé');
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur fetchProfile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, refetch: fetchProfile };
};
