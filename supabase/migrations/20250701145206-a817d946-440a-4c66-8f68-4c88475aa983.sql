
-- Créer une table pour les données démographiques par âge
CREATE TABLE public.age_demographics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  age_group TEXT NOT NULL,
  mentions INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  search_context TEXT, -- Contexte de la recherche qui a généré ces données
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les données démographiques par genre
CREATE TABLE public.gender_demographics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gender TEXT NOT NULL,
  mentions INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  search_context TEXT, -- Contexte de la recherche qui a généré ces données
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur les tables
ALTER TABLE public.age_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gender_demographics ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour age_demographics
CREATE POLICY "Users can view their own age demographics" 
  ON public.age_demographics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own age demographics" 
  ON public.age_demographics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own age demographics" 
  ON public.age_demographics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour gender_demographics
CREATE POLICY "Users can view their own gender demographics" 
  ON public.gender_demographics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gender demographics" 
  ON public.gender_demographics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gender demographics" 
  ON public.gender_demographics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ajouter des index pour améliorer les performances
CREATE INDEX idx_age_demographics_user_id ON public.age_demographics(user_id);
CREATE INDEX idx_gender_demographics_user_id ON public.gender_demographics(user_id);
