import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type VisitStatus = 'not_visited' | 'visited' | 'applied' | 'not_applied';
export type VisitSource = 'companies' | 'indian_startups';

type StatusMap = Record<string, VisitStatus>;

const LOCAL_KEY = 'getnewjob_visit_statuses';

function makeKey(companyId: string, source: VisitSource) {
  return `${source}:${companyId}`;
}

export const STATUS_CONFIG: Record<VisitStatus, {
  label: string;
  dot: string;
  badge: string;
  dropdown: string;
}> = {
  not_visited: {
    label: 'Not Visited',
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
    dropdown: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  },
  visited: {
    label: 'Visited',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
    dropdown: 'hover:bg-blue-50 dark:hover:bg-blue-900/30',
  },
  applied: {
    label: 'Applied',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
    dropdown: 'hover:bg-green-50 dark:hover:bg-green-900/30',
  },
  not_applied: {
    label: 'Not Applied',
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700',
    dropdown: 'hover:bg-orange-50 dark:hover:bg-orange-900/30',
  },
};

export const ALL_STATUSES: VisitStatus[] = ['not_visited', 'visited', 'applied', 'not_applied'];

export function useVisitStatus() {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Track current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load all statuses for this user
  const loadStatuses = useCallback(async () => {
    if (!userId) {
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) setStatuses(JSON.parse(stored));
      } catch {}
      setLoading(false);
      return;
    }

    const { data, error } = await (supabase as any)
      .from('company_visits')
      .select('company_id, source, status')
      .eq('user_id', userId);

    if (!error && data) {
      const map: StatusMap = {};
      data.forEach((row: any) => {
        map[makeKey(row.company_id, row.source)] = row.status as VisitStatus;
      });
      setStatuses(map);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadStatuses(); }, [loadStatuses]);

  const getStatus = useCallback((companyId: string, source: VisitSource = 'companies'): VisitStatus => {
    return statuses[makeKey(companyId, source)] ?? 'not_visited';
  }, [statuses]);

  const setStatus = useCallback(async (
    companyId: string,
    status: VisitStatus,
    source: VisitSource = 'companies'
  ) => {
    const key = makeKey(companyId, source);

    // Optimistic update
    setStatuses(prev => {
      const updated = { ...prev, [key]: status };
      if (!userId) {
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(updated)); } catch {}
      }
      return updated;
    });

    if (!userId) return;

    await (supabase as any).from('company_visits').upsert(
      {
        user_id: userId,
        company_id: companyId,
        source,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,company_id,source' }
    );
  }, [userId]);

  // Only upgrades not_visited → visited. Won't downgrade applied/not_applied.
  const markVisited = useCallback(async (companyId: string, source: VisitSource = 'companies') => {
    const current = statuses[makeKey(companyId, source)] ?? 'not_visited';
    if (current === 'not_visited') {
      await setStatus(companyId, 'visited', source);
    }
  }, [statuses, setStatus]);

  return { statuses, getStatus, setStatus, markVisited, loading };
}
