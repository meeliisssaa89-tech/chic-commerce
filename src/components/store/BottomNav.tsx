import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Wallet, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const navItems = [
  { icon: Home, label: "الرئيسية", href: "/" },
  { icon: () => <span className="text-lg">👞</span>, label: "أحذية", href: "/category/shoes" },
  { icon: () => <span className="text-lg">🔗</span>, label: "أحزمة", href: "/category/belts" },
  { icon: Wallet, label: "محافظ", href: "/category/wallets" },
];

const BottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href} className="flex flex-col items-center gap-0.5 py-1 px-3">
              <span className={`transition-colors ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className={`text-[10px] font-medium ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-0.5 py-1 px-3 relative">
          <span className="text-muted-foreground">
            <ShoppingBag className="w-5 h-5" />
          </span>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 right-1 bg-accent text-accent-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
            >
              {totalItems}
            </motion.span>
          )}
          <span className="text-[10px] font-medium text-muted-foreground">السلة</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
