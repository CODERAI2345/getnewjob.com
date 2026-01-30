import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Company, ImportResult } from '@/types';

const COMPANIES_KEY = 'careerhub_companies';

export function useCompanies() {
  const [companies, setCompanies] = useLocalStorage<Company[]>(COMPANIES_KEY, []);

  const addCompany = useCallback((company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'isPinned'>) => {
    const newCompany: Company = {
      ...company,
      id: crypto.randomUUID(),
      isFavorite: false,
      isPinned: false,
      applicationStatus: 'not_applied',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCompanies((prev) => [...prev, newCompany]);
    return newCompany;
  }, [setCompanies]);

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    );
  }, [setCompanies]);

  const deleteCompany = useCallback((id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }, [setCompanies]);

  const toggleFavorite = useCallback((id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite, updatedAt: new Date().toISOString() } : c
      )
    );
  }, [setCompanies]);

  const togglePinned = useCallback((id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned, updatedAt: new Date().toISOString() } : c
      )
    );
  }, [setCompanies]);

  const getCompanyById = useCallback((id: string) => {
    return companies.find((c) => c.id === id);
  }, [companies]);

  const getFavoriteCompanies = useCallback(() => {
    return companies.filter((c) => c.isFavorite);
  }, [companies]);

  const getPinnedCompanies = useCallback(() => {
    return companies.filter((c) => c.isPinned);
  }, [companies]);

  const importCompanies = useCallback((data: Partial<Company>[]): ImportResult => {
    const result: ImportResult = {
      total: data.length,
      added: 0,
      skipped: 0,
      errors: [],
    };

    const newCompanies: Company[] = [];

    data.forEach((row, index) => {
      // Validate required fields
      if (!row.name || !row.careerUrl) {
        result.errors.push(`Row ${index + 1}: Missing required fields (companyName or careerUrl)`);
        return;
      }

      // Check for duplicates
      const isDuplicate = companies.some(
        (c) => 
          c.name.toLowerCase() === row.name!.toLowerCase() ||
          (row.linkedinUrl && c.linkedinUrl?.toLowerCase() === row.linkedinUrl.toLowerCase())
      );

      if (isDuplicate) {
        result.skipped++;
        return;
      }

      newCompanies.push({
        id: crypto.randomUUID(),
        name: row.name,
        careerUrl: row.careerUrl,
        linkedinUrl: row.linkedinUrl,
        foundedYear: row.foundedYear,
        hqCity: row.hqCity,
        hqCountry: row.hqCountry,
        industry: row.industry,
        companySize: row.companySize,
        technologies: row.technologies,
        description: row.description,
        notes: row.notes,
        isFavorite: false,
        isPinned: false,
        applicationStatus: 'not_applied',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      result.added++;
    });

    if (newCompanies.length > 0) {
      setCompanies((prev) => [...prev, ...newCompanies]);
    }

    return result;
  }, [companies, setCompanies]);

  const exportCompanies = useCallback(() => {
    return companies;
  }, [companies]);

  return {
    companies,
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
