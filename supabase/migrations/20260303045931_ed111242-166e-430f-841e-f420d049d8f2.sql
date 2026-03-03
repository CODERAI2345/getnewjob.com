
-- Lock down INSERT/UPDATE to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Anyone can update companies" ON public.companies;
DROP POLICY IF EXISTS "Anyone can insert portals" ON public.portals;
DROP POLICY IF EXISTS "Anyone can update portals" ON public.portals;

CREATE POLICY "Authenticated users can insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update companies" ON public.companies FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert portals" ON public.portals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update portals" ON public.portals FOR UPDATE TO authenticated USING (true);
