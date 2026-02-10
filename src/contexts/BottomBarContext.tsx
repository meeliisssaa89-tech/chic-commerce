import { createContext, useContext, useState, useEffect } from "react";

export interface BottomBarSection {
  id: string;
  name_ar: string;
  slug: string;
  isVisible: boolean;
}

interface BottomBarContextType {
  sections: BottomBarSection[];
  updateSection: (id: string, isVisible: boolean) => void;
  addSection: (section: BottomBarSection) => void;
  removeSection: (id: string) => void;
  getVisibleSections: () => BottomBarSection[];
}

const BottomBarContext = createContext<BottomBarContextType | undefined>(undefined);

const DEFAULT_SECTIONS: BottomBarSection[] = [
  { id: "1", name_ar: "أحذية", slug: "shoes", isVisible: true },
  { id: "2", name_ar: "أحزمة", slug: "belts", isVisible: true },
  { id: "3", name_ar: "محافظ", slug: "wallets", isVisible: true },
];

export const BottomBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<BottomBarSection[]>(() => {
    const stored = localStorage.getItem("bottomBarSections");
    return stored ? JSON.parse(stored) : DEFAULT_SECTIONS;
  });

  useEffect(() => {
    localStorage.setItem("bottomBarSections", JSON.stringify(sections));
  }, [sections]);

  const updateSection = (id: string, isVisible: boolean) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isVisible } : section
      )
    );
  };

  const addSection = (section: BottomBarSection) => {
    setSections((prev) => [...prev, section]);
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const getVisibleSections = () => {
    return sections.filter((section) => section.isVisible);
  };

  return (
    <BottomBarContext.Provider
      value={{
        sections,
        updateSection,
        addSection,
        removeSection,
        getVisibleSections,
      }}
    >
      {children}
    </BottomBarContext.Provider>
  );
};

export const useBottomBar = () => {
  const context = useContext(BottomBarContext);
  if (!context) {
    throw new Error("useBottomBar must be used within BottomBarProvider");
  }
  return context;
};
