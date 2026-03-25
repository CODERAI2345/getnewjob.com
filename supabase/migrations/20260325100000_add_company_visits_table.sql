-- Track per-user visit and application status for both Companies and Indian Startups pages

CREATE TABLE IF NOT EXISTS public.company_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'companies',
  status TEXT NOT NULL DEFAULT 'not_visited',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id, source)
);

ALTER TABLE public.company_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own visits"
  ON public.company_visits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visits"
  ON public.company_visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visits"
  ON public.company_visits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visits"
  ON public.company_visits FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_company_visits_user ON public.company_visits (user_id);
CREATE INDEX IF NOT EXISTS idx_company_visits_user_source ON public.company_visits (user_id, source);
