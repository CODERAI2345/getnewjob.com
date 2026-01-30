import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Portal } from '@/types';

const PORTALS_KEY = 'careerhub_portals';

export function usePortals() {
  const [portals, setPortals] = useLocalStorage<Portal[]>(PORTALS_KEY, []);

  const addPortal = useCallback((portal: Omit<Portal, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => {
    const newPortal: Portal = {
      ...portal,
      id: crypto.randomUUID(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPortals((prev) => [...prev, newPortal]);
    return newPortal;
  }, [setPortals]);

  const updatePortal = useCallback((id: string, updates: Partial<Portal>) => {
    setPortals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, [setPortals]);

  const deletePortal = useCallback((id: string) => {
    setPortals((prev) => prev.filter((p) => p.id !== id));
  }, [setPortals]);

  const toggleFavorite = useCallback((id: string) => {
    setPortals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite, updatedAt: new Date().toISOString() } : p
      )
    );
  }, [setPortals]);

  const getPortalById = useCallback((id: string) => {
    return portals.find((p) => p.id === id);
  }, [portals]);

  const getFavoritePortals = useCallback(() => {
    return portals.filter((p) => p.isFavorite);
  }, [portals]);

  return {
    portals,
    addPortal,
    updatePortal,
    deletePortal,
    toggleFavorite,
    getPortalById,
    getFavoritePortals,
  };
}
