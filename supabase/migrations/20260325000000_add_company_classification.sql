ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS company_type TEXT,
  ADD COLUMN IF NOT EXISTS is_unicorn BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS funding_stage TEXT,
  ADD COLUMN IF NOT EXISTS funding_amount TEXT,
  ADD COLUMN IF NOT EXISTS sector TEXT,
  ADD COLUMN IF NOT EXISTS revenue_model TEXT;

CREATE INDEX IF NOT EXISTS idx_companies_company_type   ON public.companies (company_type);
CREATE INDEX IF NOT EXISTS idx_companies_is_unicorn     ON public.companies (is_unicorn);
CREATE INDEX IF NOT EXISTS idx_companies_funding_stage  ON public.companies (funding_stage);
CREATE INDEX IF NOT EXISTS idx_companies_sector         ON public.companies (sector);
