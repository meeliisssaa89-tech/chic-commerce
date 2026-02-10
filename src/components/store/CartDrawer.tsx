import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-xl font-bold">سلة التسوق</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg mb-2">السلة فارغة</p>
                  <p className="text-sm">ابدأ التسوق الآن!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex gap-3 bg-card p-3 rounded-lg"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-secondary" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.size && `المقاس: ${item.size}`} {item.color && `اللون: ${item.color}`}
                        </p>
                      )}
                      <p className="font-bold text-sm mt-1">{item.price} ر.س</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="mr-auto text-destructive hover:text-destructive/80">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع</span>
                  <span>{totalPrice} ر.س</span>
                </div>
                <Link to="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-charcoal text-cream hover:bg-accent hover:text-accent-foreground h-12 text-base font-bold">
                    إتمام الطلب
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
