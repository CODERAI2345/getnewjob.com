import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Collection } from '@/types';

const COLLECTIONS_KEY = 'careerhub_collections';

export function useCollections() {
  const [collections, setCollections] = useLocalStorage<Collection[]>(COLLECTIONS_KEY, []);

  const addCollection = useCallback((collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'companyIds'>) => {
    const newCollection: Collection = {
      ...collection,
      id: crypto.randomUUID(),
      companyIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCollection]);
    return newCollection;
  }, [setCollections]);

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    );
  }, [setCollections]);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, [setCollections]);

  const addCompanyToCollection = useCallback((collectionId: string, companyId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.companyIds.includes(companyId)
          ? { ...c, companyIds: [...c.companyIds, companyId], updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, [setCollections]);

  const removeCompanyFromCollection = useCallback((collectionId: string, companyId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, companyIds: c.companyIds.filter((id) => id !== companyId), updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, [setCollections]);

  const getCollectionById = useCallback((id: string) => {
    return collections.find((c) => c.id === id);
  }, [collections]);

  const getCollectionsForCompany = useCallback((companyId: string) => {
    return collections.filter((c) => c.companyIds.includes(companyId));
  }, [collections]);

  return {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCompanyToCollection,
    removeCompanyFromCollection,
    getCollectionById,
    getCollectionsForCompany,
  };
}
