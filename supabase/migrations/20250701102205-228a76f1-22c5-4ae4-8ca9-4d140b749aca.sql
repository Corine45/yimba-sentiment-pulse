
-- Supprimer la politique existante qui est trop restrictive
DROP POLICY IF EXISTS "Authenticated users can view platforms" ON public.social_platforms;

-- Créer une nouvelle politique permettant à tous les utilisateurs authentifiés de voir les plateformes
CREATE POLICY "All authenticated users can view platforms" 
  ON public.social_platforms 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);
