import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/useSupabaseData";

const FeaturedProducts = () => {
  const { data: featured = [] } = useFeaturedProducts();

  if (featured.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-secondary/50">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
        >
          منتجات مميزة
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-center mb-12"
        >
          اختيارنا من أفضل المنتجات لهذا الموسم
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name_ar={product.name_ar}
              slug={product.slug}
              price={product.price}
              discount_price={product.discount_price}
              image={product.images?.[0] || "/placeholder.svg"}
              category_ar={product.categories?.name_ar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
