import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api.js';

const StoreSettingsContext = createContext(null);

const storageKey = 'store-settings-public';

const readCachedSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || 'null');
  } catch {
    return null;
  }
};

export const useStoreSettings = () => useContext(StoreSettingsContext);

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => readCachedSettings());
  const [loading, setLoading] = useState(!readCachedSettings());

  const persistSettings = (nextSettings) => {
    localStorage.setItem(storageKey, JSON.stringify(nextSettings));
    window.dispatchEvent(new Event('store-settings-updated'));
    setSettings(nextSettings);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/public');
      persistSettings(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  return <StoreSettingsContext.Provider value={{ settings, loading, refresh }}>
    {children}
  </StoreSettingsContext.Provider>;
}
