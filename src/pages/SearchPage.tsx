import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/store/ProductCard";
import { mockProducts } from "@/data/mockProducts";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const results = query.length >= 2
    ? mockProducts.filter((p) => p.name_ar.includes(query) || p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="container py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto mb-8">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="pr-10 h-12 text-base"
            autoFocus
          />
        </div>
      </motion.div>

      {query.length >= 2 && (
        <div>
          <p className="text-muted-foreground text-sm mb-4 text-center">
            {results.length} نتيجة لـ "{query}"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {results.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name_ar={p.name_ar}
                slug={p.slug}
                price={p.price}
                discount_price={p.discount_price}
                image={p.images[0]}
                category_ar={p.category_ar}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
