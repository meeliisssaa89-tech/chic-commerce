import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { mockProducts as initialMockProducts, mockBanners as initialMockBanners } from "@/data/mockProducts";

export interface Product {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  price: number;
  discount_price: number | null;
  category_slug: string;
  category_ar: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  description_ar: string;
}

export interface Banner {
  id: string;
  title_ar: string;
  subtitle_ar: string;
  image_url: string;
}

interface ProductsContextType {
  products: Product[];
  banners: Banner[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBanner: (banner: Omit<Banner, "id">) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  getFeaturedProducts: () => Product[];
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialMockProducts);
  const [banners, setBanners] = useState<Banner[]>(initialMockBanners);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("chic_commerce_products");
      const savedBanners = localStorage.getItem("chic_commerce_banners");
      
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedBanners) setBanners(JSON.parse(savedBanners));
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem("chic_commerce_products", JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products to localStorage:", error);
    }
  }, [products]);

  // Save to localStorage whenever banners change
  useEffect(() => {
    try {
      localStorage.setItem("chic_commerce_banners", JSON.stringify(banners));
    } catch (error) {
      console.error("Failed to save banners to localStorage:", error);
    }
  }, [banners]);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now().toString(),
      },
    ]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addBanner = useCallback((banner: Omit<Banner, "id">) => {
    setBanners((prev) => [
      ...prev,
      {
        ...banner,
        id: Date.now().toString(),
      },
    ]);
  }, []);

  const updateBanner = useCallback((id: string, updates: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductsByCategory = useCallback(
    (categorySlug: string) => products.filter((p) => p.category_slug === categorySlug),
    [products]
  );

  const getFeaturedProducts = useCallback(
    () => products.filter((p) => p.featured),
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        banners,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        updateBanner,
        deleteBanner,
        getProductBySlug,
        getProductsByCategory,
        getFeaturedProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
