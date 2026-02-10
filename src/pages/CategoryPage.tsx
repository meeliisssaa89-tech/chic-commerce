import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/store/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockProducts";

const CategoryPage = () => {
  const { slug } = useParams();
  const category = mockCategories.find((c) => c.slug === slug);
  const products = mockProducts.filter((p) => p.category_slug === slug);

  return (
    <div className="container py-8 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-bold mb-8 text-center"
      >
        {category?.name_ar || "المنتجات"}
      </motion.h1>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">لا توجد منتجات في هذه الفئة حالياً</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name_ar={product.name_ar}
              slug={product.slug}
              price={product.price}
              discount_price={product.discount_price}
              image={product.images[0]}
              category_ar={product.category_ar}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
