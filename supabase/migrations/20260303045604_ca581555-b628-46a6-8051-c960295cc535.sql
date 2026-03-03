
-- Drop restrictive policies
DROP POLICY IF EXISTS "Anyone can read companies" ON public.companies;
DROP POLICY IF EXISTS "Anyone can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Anyone can update companies" ON public.companies;

DROP POLICY IF EXISTS "Anyone can read portals" ON public.portals;
DROP POLICY IF EXISTS "Anyone can insert portals" ON public.portals;
DROP POLICY IF EXISTS "Anyone can update portals" ON public.portals;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Anyone can insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update companies" ON public.companies FOR UPDATE USING (true);

CREATE POLICY "Anyone can read portals" ON public.portals FOR SELECT USING (true);
CREATE POLICY "Anyone can insert portals" ON public.portals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update portals" ON public.portals FOR UPDATE USING (true);
