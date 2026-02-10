import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Portal } from '@/types';

export function usePortals() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortals = useCallback(async () => {
    const { data, error } = await supabase
      .from('portals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching portals:', error);
      return;
    }

    setPortals(
      (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        url: p.url,
        category: p.category,
        region: p.region,
        icon: p.icon,
        imageUrl: p.image_url,
        isFavorite: p.is_favorite,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPortals();
  }, [fetchPortals]);

  const addPortal = useCallback(async (portal: Omit<Portal, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => {
    const { data, error } = await supabase
      .from('portals')
      .insert({
        name: portal.name,
        url: portal.url,
        category: portal.category,
        region: portal.region,
        icon: portal.icon,
        image_url: portal.imageUrl,
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding portal:', error);
      return null;
    }

    await fetchPortals();
    return data;
  }, [fetchPortals]);

  const updatePortal = useCallback(async (id: string, updates: Partial<Portal>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.region !== undefined) dbUpdates.region = updates.region;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('portals')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating portal:', error);
      return;
    }

    await fetchPortals();
  }, [fetchPortals]);

  const deletePortal = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('portals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting portal:', error);
      return;
    }

    await fetchPortals();
  }, [fetchPortals]);

  const toggleFavorite = useCallback(async (id: string) => {
    const portal = portals.find((p) => p.id === id);
    if (!portal) return;

    await updatePortal(id, { isFavorite: !portal.isFavorite });
  }, [portals, updatePortal]);

  const getPortalById = useCallback((id: string) => {
    return portals.find((p) => p.id === id);
  }, [portals]);

  const getFavoritePortals = useCallback(() => {
    return portals.filter((p) => p.isFavorite);
  }, [portals]);

  return {
    portals,
    loading,
    addPortal,
    updatePortal,
    deletePortal,
    toggleFavorite,
    getPortalById,
    getFavoritePortals,
  };
}
