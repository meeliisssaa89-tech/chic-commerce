import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";

const ProductPage = () => {
  const { slug } = useParams();
  const product = mockProducts.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return <div className="container py-16 text-center text-muted-foreground">المنتج غير موجود</div>;
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const finalPrice = hasDiscount ? product.discount_price! : product.price;

  const related = mockProducts
    .filter((p) => p.category_slug === product.category_slug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name_ar,
        price: finalPrice,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
      },
      quantity
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 600);
  };

  return (
    <div className="container py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-secondary rounded-lg overflow-hidden"
        >
          <img src={product.images[0]} alt={product.name_ar} className="w-full h-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-muted-foreground text-sm mb-2">{product.category_ar}</p>
          <h1 className="font-display text-3xl font-bold mb-4">{product.name_ar}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{finalPrice} ر.س</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">{product.price} ر.س</span>
                <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded">
                  خصم {Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.description_ar}</p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="font-medium mb-2">اللون</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <motion.button
                    key={color}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded text-sm transition-colors ${
                      selectedColor === color
                        ? "border-accent bg-accent/10 font-bold"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-medium mb-2">المقاس</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded flex items-center justify-center text-sm transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent/10 font-bold"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="font-medium mb-2">الكمية</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleAddToCart}
              className={`w-full h-14 text-base font-bold gap-2 transition-all ${
                addedAnimation
                  ? "bg-accent text-accent-foreground"
                  : "bg-charcoal text-cream hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {addedAnimation ? "تمت الإضافة ✓" : "أضف إلى السلة"}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name_ar={p.name_ar}
                slug={p.slug}
                price={p.price}
                discount_price={p.discount_price}
                image={p.images[0]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
