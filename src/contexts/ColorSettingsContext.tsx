import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface ColorSettings {
  primary: string;
  accent: string;
  secondary: string;
  background: string;
  foreground: string;
  charcoal: string;
  cream: string;
  border: string;
  muted: string;
  destructive: string;
}

interface ColorSettingsContextType {
  colors: ColorSettings;
  updateColors: (updates: Partial<ColorSettings>) => void;
  resetColors: () => void;
  applyColors: () => void;
}

const defaultColors: ColorSettings = {
  primary: "#000000",
  accent: "#d4af37",
  secondary: "#f5f5f5",
  background: "#ffffff",
  foreground: "#1a1a1a",
  charcoal: "#2c2c2c",
  cream: "#f4f0e8",
  border: "#e0e0e0",
  muted: "#808080",
  destructive: "#ef4444",
};

const ColorSettingsContext = createContext<ColorSettingsContextType | null>(null);

export const useColorSettings = () => {
  const ctx = useContext(ColorSettingsContext);
  if (!ctx) throw new Error("useColorSettings must be used within ColorSettingsProvider");
  return ctx;
};

export const ColorSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ColorSettings>(defaultColors);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chic_commerce_colors");
      if (saved) {
        setColors(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load colors from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever colors change
  useEffect(() => {
    try {
      localStorage.setItem("chic_commerce_colors", JSON.stringify(colors));
      applyColors();
    } catch (error) {
      console.error("Failed to save colors to localStorage:", error);
    }
  }, [colors]);

  const updateColors = useCallback((updates: Partial<ColorSettings>) => {
    setColors((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetColors = useCallback(() => {
    setColors(defaultColors);
    localStorage.removeItem("chic_commerce_colors");
  }, []);

  const applyColors = useCallback(() => {
    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHSL = (hex: string) => {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply CSS variables
    root.style.setProperty("--primary", hexToHSL(colors.primary));
    root.style.setProperty("--accent", hexToHSL(colors.accent));
    root.style.setProperty("--secondary", hexToHSL(colors.secondary));
    root.style.setProperty("--background", hexToHSL(colors.background));
    root.style.setProperty("--foreground", hexToHSL(colors.foreground));
    root.style.setProperty("--charcoal", hexToHSL(colors.charcoal));
    root.style.setProperty("--cream", hexToHSL(colors.cream));
    root.style.setProperty("--border", hexToHSL(colors.border));
    root.style.setProperty("--muted", hexToHSL(colors.muted));
    root.style.setProperty("--destructive", hexToHSL(colors.destructive));
  }, [colors]);

  return (
    <ColorSettingsContext.Provider value={{ colors, updateColors, resetColors, applyColors }}>
      {children}
    </ColorSettingsContext.Provider>
  );
};
