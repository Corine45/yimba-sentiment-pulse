
-- Ajuster les rôles des utilisateurs existants
UPDATE public.profiles 
SET role = 'observateur' 
WHERE email = 'admin-observateur1@yimba.com';

UPDATE public.profiles 
SET role = 'analyste' 
WHERE email = 'analyseyimba@test.com';

-- Mettre à jour les rôles dans user_roles
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email IN ('admin-observateur1@yimba.com', 'analyseyimba@test.com')
);

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'observateur'::app_role 
FROM public.profiles 
WHERE email = 'admin-observateur1@yimba.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'analyste'::app_role 
FROM public.profiles 
WHERE email = 'analyseyimba@test.com';

-- Corriger les politiques RLS pour permettre aux admins de voir tous les utilisateurs
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;

-- Nouvelles politiques RLS plus permissives
CREATE POLICY "Users can view their own profile and admins can view all" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles and admins can view all" 
  ON public.user_roles 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Permettre aux admins de voir toutes les sessions
CREATE POLICY "Admins can view all sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Afficher le récapitulatif final
SELECT 
  p.name, 
  p.email, 
  p.role,
  CASE WHEN us.is_active THEN 'Actif' ELSE 'Inactif' END as status
FROM public.profiles p
LEFT JOIN public.user_sessions us ON p.id = us.user_id
ORDER BY p.created_at DESC;
