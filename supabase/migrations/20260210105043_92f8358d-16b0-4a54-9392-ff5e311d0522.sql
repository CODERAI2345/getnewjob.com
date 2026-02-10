
-- Create portals table
CREATE TABLE public.portals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  region TEXT,
  icon TEXT,
  image_url TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_title_html TEXT,
  logo_url TEXT,
  career_url TEXT NOT NULL DEFAULT '',
  website TEXT,
  linkedin_url TEXT,
  founded_year INTEGER,
  hq_city TEXT,
  hq_country TEXT,
  hq TEXT,
  location TEXT,
  industry TEXT,
  company_size TEXT,
  technologies TEXT[],
  description TEXT,
  about TEXT,
  notes TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  application_status TEXT DEFAULT 'not_applied',
  applied_date TEXT,
  hr_contact TEXT,
  collection_ids TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone with the link can view)
CREATE POLICY "Anyone can read portals" ON public.portals FOR SELECT USING (true);
CREATE POLICY "Anyone can read companies" ON public.companies FOR SELECT USING (true);

-- Public write access (no auth for now, admin-style app)
CREATE POLICY "Anyone can insert portals" ON public.portals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update portals" ON public.portals FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete portals" ON public.portals FOR DELETE USING (true);

CREATE POLICY "Anyone can insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update companies" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete companies" ON public.companies FOR DELETE USING (true);

-- Storage bucket for portal/company images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policies
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Anyone can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Anyone can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Anyone can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');
