
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔐 Initialisation du contexte d\'authentification');
    
    // Configuration du listener AVANT de vérifier la session existante
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth state change: ${event}`, session?.user?.email);
        
        // Mise à jour synchrone des états
        setSession(session);
        setUser(session?.user ?? null);
        
        // Gérer les événements spécifiques
        if (event === 'SIGNED_IN') {
          console.log('✅ Utilisateur connecté:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 Utilisateur déconnecté');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token rafraîchi pour:', session?.user?.email);
        }
        
        setLoading(false);
      }
    );

    // Vérification de la session existante APRÈS avoir configuré le listener
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
        } else {
          console.log('📋 Session existante vérifiée:', session?.user?.email || 'aucune');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Erreur de vérification de session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log('🧹 Nettoyage du listener d\'authentification');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Tentative de connexion pour:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erreur de connexion:', error.message);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Connexion réussie:', data.user?.email);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user?.email}`,
        });
      }

      return { error };
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la connexion:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('📝 Tentative d\'inscription pour:', email);
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Erreur d\'inscription:', error.message);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Inscription réussie:', data.user?.email);
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
      }

      return { error };
    } catch (error) {
      console.error('❌ Erreur inattendue lors de l\'inscription:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('🚪 Déconnexion en cours...');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erreur de déconnexion:', error.message);
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Déconnexion réussie');
        // Les états seront mis à jour automatiquement par le listener
        toast({
          title: "Déconnexion réussie",
          description: "À bientôt !",
        });
      }
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
