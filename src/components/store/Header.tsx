import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { settings } = useSettings();

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "أحذية", href: "/category/shoes" },
    { label: "أحزمة", href: "/category/belts" },
    { label: "محافظ", href: "/category/wallets" },
    { label: "تواصل معنا", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2">
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center gap-2 font-display text-xl md:text-2xl font-bold tracking-wider text-charcoal hover:text-accent transition-colors">
          {settings.logo && (
            <img 
              src={settings.logo} 
              alt={settings.siteName} 
              className="h-8 md:h-10 object-contain"
            />
          )}
          <span className="hidden md:inline">{settings.siteNameAr}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-sm font-medium hover:text-accent transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/search" className="p-2 hover:text-accent transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <button onClick={() => setIsOpen(true)} className="p-2 relative hover:text-accent transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-background z-50 shadow-2xl p-6"
            >
              <button onClick={() => setMenuOpen(false)} className="mb-8">
                <X className="w-6 h-6" />
              </button>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium py-2 border-b border-border hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
