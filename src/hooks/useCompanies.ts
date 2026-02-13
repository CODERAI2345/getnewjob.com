import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company, ImportResult } from '@/types';

function mapRow(c: any): Company {
  return {
    id: c.id,
    name: c.name,
    brandTitleHtml: c.brand_title_html,
    logoUrl: c.logo_url,
    careerUrl: c.career_url,
    website: c.website,
    linkedinUrl: c.linkedin_url,
    foundedYear: c.founded_year,
    hqCity: c.hq_city,
    hqCountry: c.hq_country,
    hq: c.hq,
    location: c.location,
    industry: c.industry,
    companySize: c.company_size,
    technologies: c.technologies,
    description: c.description,
    about: c.about,
    notes: c.notes,
    brandColor: c.brand_color,
    gradientColor1: c.gradient_color_1,
    gradientColor2: c.gradient_color_2,
    gradientAngle: c.gradient_angle,
    buttonGradientColor1: c.button_gradient_color_1,
    buttonGradientColor2: c.button_gradient_color_2,
    buttonGradientAngle: c.button_gradient_angle,
    isFavorite: c.is_favorite,
    isPinned: c.is_pinned,
    applicationStatus: c.application_status,
    appliedDate: c.applied_date,
    hrContact: c.hr_contact,
    collectionIds: c.collection_ids,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

function toDbRow(data: Partial<Company>): any {
  const row: any = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.brandTitleHtml !== undefined) row.brand_title_html = data.brandTitleHtml;
  if (data.logoUrl !== undefined) row.logo_url = data.logoUrl;
  if (data.careerUrl !== undefined) row.career_url = data.careerUrl;
  if (data.website !== undefined) row.website = data.website;
  if (data.linkedinUrl !== undefined) row.linkedin_url = data.linkedinUrl;
  if (data.foundedYear !== undefined) row.founded_year = data.foundedYear;
  if (data.hqCity !== undefined) row.hq_city = data.hqCity;
  if (data.hqCountry !== undefined) row.hq_country = data.hqCountry;
  if (data.hq !== undefined) row.hq = data.hq;
  if (data.location !== undefined) row.location = data.location;
  if (data.industry !== undefined) row.industry = data.industry;
  if (data.companySize !== undefined) row.company_size = data.companySize;
  if (data.technologies !== undefined) row.technologies = data.technologies;
  if (data.description !== undefined) row.description = data.description;
  if (data.about !== undefined) row.about = data.about;
  if (data.notes !== undefined) row.notes = data.notes;
  if (data.brandColor !== undefined) row.brand_color = data.brandColor;
  if (data.gradientColor1 !== undefined) row.gradient_color_1 = data.gradientColor1;
  if (data.gradientColor2 !== undefined) row.gradient_color_2 = data.gradientColor2;
  if (data.gradientAngle !== undefined) row.gradient_angle = data.gradientAngle;
  if (data.buttonGradientColor1 !== undefined) row.button_gradient_color_1 = data.buttonGradientColor1;
  if (data.buttonGradientColor2 !== undefined) row.button_gradient_color_2 = data.buttonGradientColor2;
  if (data.buttonGradientAngle !== undefined) row.button_gradient_angle = data.buttonGradientAngle;
  if (data.isFavorite !== undefined) row.is_favorite = data.isFavorite;
  if (data.isPinned !== undefined) row.is_pinned = data.isPinned;
  if (data.applicationStatus !== undefined) row.application_status = data.applicationStatus;
  if (data.appliedDate !== undefined) row.applied_date = data.appliedDate;
  if (data.hrContact !== undefined) row.hr_contact = data.hrContact;
  if (data.collectionIds !== undefined) row.collection_ids = data.collectionIds;
  return row;
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      return;
    }

    setCompanies((data || []).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const addCompany = useCallback(async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'isPinned'>) => {
    const row = toDbRow(company);
    row.is_favorite = false;
    row.is_pinned = false;
    row.application_status = 'not_applied';

    const { error } = await supabase.from('companies').insert(row);

    if (error) {
      console.error('Error adding company:', error);
      return null;
    }

    await fetchCompanies();
  }, [fetchCompanies]);

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    const row = toDbRow(updates);
    row.updated_at = new Date().toISOString();

    const { error } = await supabase.from('companies').update(row).eq('id', id);

    if (error) {
      console.error('Error updating company:', error);
      return;
    }

    await fetchCompanies();
  }, [fetchCompanies]);

  const deleteCompany = useCallback(async (id: string) => {
    const { error } = await supabase.from('companies').delete().eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      return;
    }

    await fetchCompanies();
  }, [fetchCompanies]);

  const toggleFavorite = useCallback(async (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (!company) return;
    await updateCompany(id, { isFavorite: !company.isFavorite });
  }, [companies, updateCompany]);

  const togglePinned = useCallback(async (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (!company) return;
    await updateCompany(id, { isPinned: !company.isPinned });
  }, [companies, updateCompany]);

  const getCompanyById = useCallback((id: string) => {
    return companies.find((c) => c.id === id);
  }, [companies]);

  const getFavoriteCompanies = useCallback(() => {
    return companies.filter((c) => c.isFavorite);
  }, [companies]);

  const getPinnedCompanies = useCallback(() => {
    return companies.filter((c) => c.isPinned);
  }, [companies]);

  const importCompanies = useCallback(async (data: Partial<Company>[]): Promise<ImportResult> => {
    const result: ImportResult = {
      total: data.length,
      added: 0,
      skipped: 0,
      errors: [],
    };

    const rows: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row.name) {
        result.errors.push(`Row ${i + 1}: Missing required field (Company Name)`);
        continue;
      }

      const isDuplicate = companies.some(
        (c) => c.name.toLowerCase() === row.name!.toLowerCase()
      );

      if (isDuplicate) {
        result.skipped++;
        continue;
      }

      rows.push({
        name: row.name,
        brand_title_html: row.brandTitleHtml,
        logo_url: row.logoUrl,
        career_url: row.careerUrl || row.website || '#',
        website: row.website,
        linkedin_url: row.linkedinUrl,
        founded_year: row.foundedYear,
        hq_city: row.hqCity || row.location,
        hq_country: row.hqCountry || row.hq,
        hq: row.hq,
        location: row.location,
        industry: row.industry,
        company_size: row.companySize,
        technologies: row.technologies,
        description: row.description || row.about,
        about: row.about,
        notes: row.notes,
        is_favorite: false,
        is_pinned: false,
        application_status: 'not_applied',
      });
      result.added++;
    }

    if (rows.length > 0) {
      const { error } = await supabase.from('companies').insert(rows);
      if (error) {
        console.error('Error importing companies:', error);
        result.errors.push('Database error during import');
        result.added = 0;
      } else {
        await fetchCompanies();
      }
    }

    return result;
  }, [companies, fetchCompanies]);

  const exportCompanies = useCallback(() => {
    return companies;
  }, [companies]);

  return {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    toggleFavorite,
    togglePinned,
    getCompanyById,
    getFavoriteCompanies,
    getPinnedCompanies,
    importCompanies,
    exportCompanies,
  };
}
