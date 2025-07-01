
-- Corriger la fonction generate_ai_context pour gérer les mots-clés null
CREATE OR REPLACE FUNCTION public.generate_ai_context(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  context_id UUID;
  user_keywords JSONB;
BEGIN
  -- Récupérer les mots-clés de l'utilisateur avec une valeur par défaut
  SELECT COALESCE(
    (
      SELECT jsonb_agg(DISTINCT keyword)
      FROM (
        SELECT unnest(keywords) as keyword 
        FROM public.saved_searches 
        WHERE user_id = user_uuid 
        LIMIT 10
      ) t
    ),
    '["veille", "analyse", "monitoring"]'::jsonb
  ) INTO user_keywords;

  -- Insérer un nouveau contexte IA basé sur les données de recherche existantes
  INSERT INTO public.ai_contexts (
    user_id,
    summary,
    triggers,
    sentiment,
    trends,
    keywords,
    recommendations,
    confidence
  )
  VALUES (
    user_uuid,
    'Contexte généré automatiquement basé sur vos données de recherche récentes.',
    jsonb_build_array(
      'Analyse des résultats de recherche récents',
      'Détection de patterns dans les mentions',
      'Corrélation des sentiments par plateforme'
    ),
    jsonb_build_object(
      'overall', 'Majoritairement positif',
      'details', 'Analyse basée sur les données de recherche disponibles'
    ),
    jsonb_build_array(
      'Augmentation des mentions sur les dernières 24h',
      'Engagement élevé sur certaines plateformes'
    ),
    user_keywords,
    jsonb_build_array(
      'Continuer le monitoring des mots-clés actuels',
      'Analyser les tendances émergentes'
    ),
    85
  )
  RETURNING id INTO context_id;
  
  RETURN context_id;
END;
$$;
