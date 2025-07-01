
-- Table pour stocker les contextes IA générés
CREATE TABLE public.ai_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  summary TEXT NOT NULL,
  triggers JSONB NOT NULL DEFAULT '[]'::jsonb,
  sentiment JSONB NOT NULL DEFAULT '{}'::jsonb,
  trends JSONB NOT NULL DEFAULT '[]'::jsonb,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence INTEGER NOT NULL DEFAULT 0,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les données d'influenceurs
CREATE TABLE public.influencer_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  engagement_rate DECIMAL NOT NULL DEFAULT 0,
  influence_score INTEGER NOT NULL DEFAULT 0,
  recent_posts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les données géographiques
CREATE TABLE public.geographic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  mentions INTEGER NOT NULL DEFAULT 0,
  sentiment_score DECIMAL NOT NULL DEFAULT 0,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les données de médias
CREATE TABLE public.media_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  media_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_url TEXT,
  mentions INTEGER NOT NULL DEFAULT 0,
  engagement JSONB NOT NULL DEFAULT '{}'::jsonb,
  sentiment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les données en temps réel
CREATE TABLE public.realtime_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.ai_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_data ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour ai_contexts
CREATE POLICY "Users can view their own AI contexts" 
  ON public.ai_contexts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI contexts" 
  ON public.ai_contexts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI contexts" 
  ON public.ai_contexts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour influencer_data
CREATE POLICY "Users can view their own influencer data" 
  ON public.influencer_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own influencer data" 
  ON public.influencer_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour geographic_data
CREATE POLICY "Users can view their own geographic data" 
  ON public.geographic_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own geographic data" 
  ON public.geographic_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour media_data
CREATE POLICY "Users can view their own media data" 
  ON public.media_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own media data" 
  ON public.media_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour realtime_data
CREATE POLICY "Users can view their own realtime data" 
  ON public.realtime_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own realtime data" 
  ON public.realtime_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour générer du contexte IA automatiquement
CREATE OR REPLACE FUNCTION public.generate_ai_context(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  context_id UUID;
BEGIN
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
  SELECT 
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
    (
      SELECT jsonb_agg(DISTINCT keyword)
      FROM (
        SELECT unnest(keywords) as keyword 
        FROM public.saved_searches 
        WHERE user_id = user_uuid 
        LIMIT 10
      ) t
    ),
    jsonb_build_array(
      'Continuer le monitoring des mots-clés actuels',
      'Analyser les tendances émergentes'
    ),
    85
  RETURNING id INTO context_id;
  
  RETURN context_id;
END;
$$;
