
-- Add new company detail fields
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS core_strength text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS hiring_technologies text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS future_direction text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS organization_strength text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS notable_products text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS career_benefits text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS stage text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS headcount text;
