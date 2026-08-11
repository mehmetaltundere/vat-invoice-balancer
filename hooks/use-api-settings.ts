"use client";

import { useState, useEffect } from "react";

export interface ApiSettings {
  ideaSoftClientId: string;
  ideaSoftClientSecret: string;
  dopigoApiToken: string;
}

const STORAGE_KEY = "nexus_vat_api_settings";

const defaultSettings: ApiSettings = {
  ideaSoftClientId: "ideasoft_live_88492019",
  ideaSoftClientSecret: "sec_live_99182374910238a72b",
  dopigoApiToken: "dop_live_tok_77281920384c901",
};

export function useApiSettings() {
  const [settings, setSettings] = useState<ApiSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
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
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
          setSettings(newSettings);
          resolve(true);
        } catch (e) {
          console.error("Failed to save API settings", e);
          resolve(false);
        }
      }, 750); // Simulate smooth network / saving latency
    });
  };

  return {
    settings,
    isLoaded,
    saveSettings,
  };
}
