ALTER TABLE public.indian_startups
  ADD COLUMN IF NOT EXISTS funding TEXT;

COMMENT ON COLUMN public.indian_startups.funding IS 'Funding stage and amount e.g. Series B · $50M';
