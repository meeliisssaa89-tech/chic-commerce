import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name_ar: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  image: string;
  category_ar?: string;
}

const ProductCard = ({ id, name_ar, slug, price, discount_price, image, category_ar }: ProductCardProps) => {
  const { addItem } = useCart();
  const hasDiscount = discount_price && discount_price < price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name: name_ar,
      price: hasDiscount ? discount_price : price,
      image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/product/${slug}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          {/* Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded">
              خصم {Math.round(((price - discount_price) / price) * 100)}%
            </div>
          )}

          {/* Image */}
          <div className="aspect-square overflow-hidden bg-secondary">
            <img
              src={image}
              alt={name_ar}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div className="p-4">
            {category_ar && <p className="text-xs text-muted-foreground mb-1">{category_ar}</p>}
            <h3 className="font-medium text-sm mb-2 line-clamp-2">{name_ar}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">
                  {hasDiscount ? discount_price : price} ر.س
                </span>
                {hasDiscount && (
                  <span className="text-muted-foreground text-xs line-through">{price} ر.س</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 bg-charcoal text-cream rounded-full hover:bg-accent transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
