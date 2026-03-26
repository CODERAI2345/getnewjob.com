-- Add roles_hiring field to indian_startups table

ALTER TABLE public.indian_startups
  ADD COLUMN IF NOT EXISTS roles_hiring TEXT[],
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

COMMENT ON COLUMN public.indian_startups.roles_hiring IS 'Active roles being hired e.g. ["Software Engineer","Product Manager"]';
