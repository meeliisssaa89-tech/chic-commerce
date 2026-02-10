import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface SiteSettings {
  siteName: string;
  siteNameAr: string;
  logo: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  email: string;
  address: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
}

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: SiteSettings = {
  siteName: "Chic Commerce",
  siteNameAr: "شيك كومرس",
  logo: "/placeholder.svg",
  currency: "SAR",
  currencySymbol: "ر.س",
  phone: "+966501234567",
  email: "info@chiccommerce.com",
  address: "الرياض، المملكة العربية السعودية",
  taxRate: 15,
  shippingCost: 50,
  freeShippingThreshold: 500,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chic_commerce_settings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem("chic_commerce_settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem("chic_commerce_settings");
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
