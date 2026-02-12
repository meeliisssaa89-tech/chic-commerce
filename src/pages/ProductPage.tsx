import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useSupabaseData";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";

const ProductPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const categorySlug = product?.categories?.slug;
  const { data: allProducts = [] } = useProducts(categorySlug);
  const related = allProducts.filter((p) => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-secondary rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary rounded animate-pulse w-3/4" />
            <div className="h-6 bg-secondary rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container py-16 text-center text-muted-foreground">المنتج غير موجود</div>;
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const finalPrice = hasDiscount ? product.discount_price! : product.price;
  const images = product.images?.length ? product.images : ["/placeholder.svg"];
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name_ar,
        price: finalPrice,
        image: images[0],
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
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-3">
            <img src={images[selectedImage]} alt={product.name_ar} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                    i === selectedImage ? "border-accent" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-muted-foreground text-sm mb-2">{product.categories?.name_ar}</p>
          <h1 className="font-display text-3xl font-bold mb-4">{product.name_ar}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{finalPrice} ج.م</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">{product.price} ج.م</span>
                <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded">
                  خصم {Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.description_ar}</p>

          {colors.length > 0 && (
            <div className="mb-6">
              <p className="font-medium mb-2">اللون</p>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded text-sm transition-colors ${
                      selectedColor === color ? "border-accent bg-accent/10 font-bold" : "border-border hover:border-accent/50"
                    }`}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-medium mb-2">المقاس</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded flex items-center justify-center text-sm transition-colors ${
                      selectedSize === size ? "border-accent bg-accent/10 font-bold" : "border-border hover:border-accent/50"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="font-medium mb-2">الكمية</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

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

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-sm text-accent mt-3 text-center">باقي {product.stock} قطع فقط!</p>
          )}
        </motion.div>
      </div>

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
                image={p.images?.[0] || "/placeholder.svg"}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
