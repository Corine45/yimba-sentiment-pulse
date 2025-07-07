import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    console.log('🔐 AuthProvider: Initialisation unique');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log(`🔄 AuthProvider: ${event}`, session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Charger le profil
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', session.user.email)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (profileData && mounted) {
              console.log('✅ Profil chargé:', profileData);
              setProfile(profileData);
            }
          } catch (error) {
            console.error('❌ Erreur profil:', error);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        if (mounted) setLoading(false);
      }
    );

    // Vérification session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        
        // Charger le profil initial
        supabase
          .from('profiles')
          .select('*')
          .eq('email', session.user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
          .then(({ data: profileData }) => {
            if (profileData && mounted) {
              console.log('✅ Profil initial:', profileData);
              setProfile(profileData);
            }
            if (mounted) setLoading(false);
          });
      } else {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}