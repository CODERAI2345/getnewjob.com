export type PortalRegion = 'remote' | 'germany' | 'finland' | 'sweden' | 'norway' | 'all';

export interface Portal {
  id: string;
  name: string;
  url: string;
  category: string;
  region?: PortalRegion;
  icon?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  brandTitleHtml?: string;
  logoUrl?: string;
  careerUrl: string;
  website?: string;
  linkedinUrl?: string;
  foundedYear?: number;
  hqCity?: string;
  hqCountry?: string;
  hq?: string;
  location?: string;
  industry?: string;
  companySize?: string;
  technologies?: string[];
  description?: string;
  about?: string;
  notes?: string;
  isFavorite: boolean;
  isPinned: boolean;
  applicationStatus?: ApplicationStatus;
  appliedDate?: string;
  hrContact?: string;
  collectionIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  companyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 
  | 'not_applied' 
  | 'applied' 
  | 'interview' 
  | 'offer' 
  | 'rejected';

export interface ImportResult {
  total: number;
  added: number;
  skipped: number;
  errors: string[];
}

export type SortOption = 'a-z' | 'z-a' | 'newest' | 'oldest' | 'size';

export interface FilterState {
  search: string;
  industry?: string;
  companySize?: string;
  location?: string;
  technologies?: string[];
}
