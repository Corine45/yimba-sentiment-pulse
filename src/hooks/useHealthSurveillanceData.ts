
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface HealthAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'faible' | 'modéré' | 'critique';
  status: 'nouveau' | 'en_cours' | 'resolu';
  timestamp: string;
  source: string;
  description: string;
  verified: boolean;
  assignedTo: string | null;
  rawText: string;
  reporterName?: string;
  reporterContact?: string;
  createdAt: string;
}

interface HealthCase {
  id: string;
  alertId?: string;
  disease: string;
  location: string;
  status: 'nouveau' | 'en_cours' | 'resolu';
  priority: 'faible' | 'normale' | 'haute' | 'critique';
  assignedTo: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const useHealthSurveillanceData = () => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [cases, setCases] = useState<HealthCase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHealthAlerts = async () => {
    if (!user) return;

    try {
      // Récupérer les données de recherche récentes pour créer des alertes sanitaires
      const { data: searchResults, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Erreur lors de la récupération des données de recherche:', error);
        return;
      }

      // Transformer les résultats en alertes sanitaires basées sur des mots-clés de santé
      const healthKeywords = ['covid', 'paludisme', 'dengue', 'rougeole', 'fièvre', 'épidémie', 'maladie', 'santé', 'médical', 'hôpital'];
      
      const healthAlerts: HealthAlert[] = (searchResults || [])
        .filter(result => 
          healthKeywords.some(keyword => 
            result.search_term.toLowerCase().includes(keyword)
          )
        )
        .map(result => {
          const severity = result.total_mentions > 100 ? 'critique' : 
                          result.total_mentions > 50 ? 'modéré' : 'faible';
          
          return {
            id: `HS-${result.id.slice(0, 8)}`,
            disease: result.search_term,
            location: 'Détectée via analyse de données',
            severity,
            status: 'nouveau' as const,
            timestamp: new Date(result.created_at).toLocaleString('fr-FR'),
            source: result.platform,
            description: `${result.total_mentions} mentions détectées sur ${result.platform}`,
            verified: result.total_mentions > 50,
            assignedTo: null,
            rawText: `Analyse automatique: ${result.total_mentions} mentions, sentiment positif: ${result.positive_sentiment}%`,
            createdAt: result.created_at
          };
        });

      setAlerts(healthAlerts);
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes sanitaires:', error);
    }
  };

  const fetchHealthCases = async () => {
    if (!user) return;

    try {
      // Récupérer les contextes IA comme cas de suivi
      const { data: aiContexts, error } = await supabase
        .from('ai_contexts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur lors de la récupération des contextes IA:', error);
        return;
      }

      // Transformer les contextes en cas de suivi sanitaire
      const healthCases: HealthCase[] = (aiContexts || []).map(context => ({
        id: `CASE-${context.id.slice(0, 8)}`,
        disease: 'Analyse contextuelle',
        location: 'Basé sur données collectées',
        status: 'en_cours' as const,
        priority: context.confidence > 80 ? 'haute' : 'normale',
        assignedTo: null,
        description: context.summary,
        createdAt: context.created_at,
        updatedAt: context.updated_at
      }));

      setCases(healthCases);
    } catch (error) {
      console.error('Erreur lors de la récupération des cas de suivi:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchHealthAlerts(), fetchHealthCases()]);
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    alerts,
    cases,
    loading,
    refetch: () => {
      if (user) {
        fetchHealthAlerts();
        fetchHealthCases();
      }
    }
  };
};
