"use client";

import { useState, useEffect } from "react";

export interface ApiSettings {
  ideaSoftClientId: string;
  ideaSoftClientSecret: string;
  dopigoApiToken: string;
}

export const EFA_STORAGE_KEY = "efa_vat_api_settings";
const LEGACY_STORAGE_KEY = "nexus_vat_api_settings";

const defaultSettings: ApiSettings = {
  ideaSoftClientId: "",
  ideaSoftClientSecret: "",
  dopigoApiToken: "",
};

export function useApiSettings() {
  const [settings, setSettings] = useState<ApiSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(EFA_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load API settings from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveSettings = (newSettings: ApiSettings): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.setItem(EFA_STORAGE_KEY, JSON.stringify(newSettings));
          setSettings(newSettings);
          resolve(true);
        } catch (e) {
          console.error("Failed to save API settings", e);
          resolve(false);
        }
      }, 500);
    });
  };

  return {
    settings,
    isLoaded,
    saveSettings,
  };
}
