import React, { createContext, useContext, useState, useCallback } from 'react';

interface LGUSettings {
  logoUrl: string;
  municipalityName: string;
  systemName: string;
}

interface LGUSettingsContextType {
  settings: LGUSettings;
  updateSettings: (newSettings: Partial<LGUSettings>) => void;
}

const defaultSettings: LGUSettings = {
  logoUrl: '',
  municipalityName: 'LGU Enrique B. Magalona',
  systemName: 'Farmer-Fisherfolk Assistance Tracking System',
};

const LGUSettingsContext = createContext<LGUSettingsContextType | null>(null);

export function LGUSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LGUSettings>(() => {
    const stored = localStorage.getItem('lgu_settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });

  const updateSettings = useCallback((newSettings: Partial<LGUSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('lgu_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <LGUSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </LGUSettingsContext.Provider>
  );
}

export function useLGUSettings() {
  const context = useContext(LGUSettingsContext);
  if (!context) throw new Error('useLGUSettings must be used within LGUSettingsProvider');
  return context;
}
