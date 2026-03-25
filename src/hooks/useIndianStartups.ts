import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface IndianStartup {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  sector: string;
  website?: string;
  careerUrl?: string;
  logoUrl?: string;
  brandColor?: string;
  companySize?: string;
  foundedYear?: number;
  hqCity?: string;
  technologies?: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapRow(r: any): IndianStartup {
  return {
    id: r.id,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    sector: r.sector || 'others',
    website: r.website,
    careerUrl: r.career_url,
    logoUrl: r.logo_url,
    brandColor: r.brand_color,
    companySize: r.company_size,
    foundedYear: r.founded_year,
    hqCity: r.hq_city,
    technologies: r.technologies,
    isFeatured: r.is_featured ?? false,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toDbRow(data: Partial<IndianStartup>): any {
  const row: any = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.tagline !== undefined) row.tagline = data.tagline;
  if (data.description !== undefined) row.description = data.description;
  if (data.sector !== undefined) row.sector = data.sector;
  if (data.website !== undefined) row.website = data.website;
  if (data.careerUrl !== undefined) row.career_url = data.careerUrl;
  if (data.logoUrl !== undefined) row.logo_url = data.logoUrl;
  if (data.brandColor !== undefined) row.brand_color = data.brandColor;
  if (data.companySize !== undefined) row.company_size = data.companySize;
  if (data.foundedYear !== undefined) row.founded_year = data.foundedYear;
  if (data.hqCity !== undefined) row.hq_city = data.hqCity;
  if (data.technologies !== undefined) row.technologies = data.technologies;
  if (data.isFeatured !== undefined) row.is_featured = data.isFeatured;
  return row;
}

export function useIndianStartups() {
  const [startups, setStartups] = useState<IndianStartup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('indian_startups')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setStartups(data.map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { fetchStartups(); }, [fetchStartups]);

  const addStartup = useCallback(async (startup: Partial<IndianStartup>) => {
    const row = toDbRow(startup);
    const { error } = await (supabase as any).from('indian_startups').insert(row);
    if (!error) await fetchStartups();
    return !error;
  }, [fetchStartups]);

  const updateStartup = useCallback(async (id: string, updates: Partial<IndianStartup>) => {
    const row = toDbRow(updates);
    row.updated_at = new Date().toISOString();
    const { error } = await (supabase as any).from('indian_startups').update(row).eq('id', id);
    if (!error) await fetchStartups();
    return !error;
  }, [fetchStartups]);

  const deleteStartup = useCallback(async (id: string) => {
    const { error } = await (supabase as any).from('indian_startups').delete().eq('id', id);
    if (!error) await fetchStartups();
    return !error;
  }, [fetchStartups]);

  const importStartups = useCallback(async (rows: Partial<IndianStartup>[]) => {
    const dbRows = rows.map(r => toDbRow(r));
    const { error } = await (supabase as any).from('indian_startups').insert(dbRows);
    if (!error) await fetchStartups();
    return !error;
  }, [fetchStartups]);

  return { startups, loading, addStartup, updateStartup, deleteStartup, importStartups, refetch: fetchStartups };
}
