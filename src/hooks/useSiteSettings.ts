import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SiteSettings {
  siteTitle: string;
  bannerUrl?: string;
  backgroundUrl?: string;
  themeColor?: string;
}

const SETTINGS_KEY = 'careerhub_settings';

const defaultSettings: SiteSettings = {
  siteTitle: 'CareerHub',
};

export function useSiteSettings() {
  const [settings, setSettings] = useLocalStorage<SiteSettings>(SETTINGS_KEY, defaultSettings);

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
