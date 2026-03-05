DROP POLICY IF EXISTS "Authenticated users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can insert portals" ON public.portals;
DROP POLICY IF EXISTS "Authenticated users can update portals" ON public.portals;

CREATE POLICY "Anyone can insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update companies" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert portals" ON public.portals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update portals" ON public.portals FOR UPDATE USING (true);