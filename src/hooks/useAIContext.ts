
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface AIContext {
  id: string;
  summary: string;
  triggers: string[];
  sentiment: {
    overall: string;
    details: string;
  };
  trends: string[];
  keywords: string[];
  recommendations: string[];
  confidence: number;
  generated_at: string;
}

export const useAIContext = () => {
  const [aiContext, setAiContext] = useState<AIContext | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAIContext = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_contexts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching AI context:', error);
        return;
      }

      if (data) {
        setAiContext({
          id: data.id,
          summary: data.summary,
          triggers: data.triggers as string[],
          sentiment: data.sentiment as { overall: string; details: string },
          trends: data.trends as string[],
          keywords: data.keywords as string[],
          recommendations: data.recommendations as string[],
          confidence: data.confidence,
          generated_at: new Date(data.generated_at).toLocaleString('fr-FR')
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewContext = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('generate_ai_context', {
        user_uuid: user.id
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de générer un nouveau contexte IA.",
          variant: "destructive",
        });
        return;
      }

      await fetchAIContext();
      
      toast({
        title: "Contexte généré",
        description: "Un nouveau contexte IA a été créé avec succès.",
      });
    } catch (error) {
      console.error('Error generating AI context:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAIContext();
  }, [user]);

  return {
    aiContext,
    loading,
    generateNewContext,
    refetch: fetchAIContext
  };
};
