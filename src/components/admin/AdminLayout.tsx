import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, Image, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { label: "المنتجات", href: "/admin/products", icon: Package },
  { label: "الفئات", href: "/admin/categories", icon: Layers },
  { label: "الطلبات", href: "/admin/orders", icon: ShoppingCart },
  { label: "البانرات", href: "/admin/banners", icon: Image },
  { label: "الإعدادات", href: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar border-l border-sidebar-border flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="font-display text-xl font-bold text-sidebar-foreground">TESTATORO</h2>
          <p className="text-sidebar-foreground/60 text-xs mt-1">لوحة الإدارة</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-bold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/60 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile Header + Sidebar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-sidebar border-b border-sidebar-border h-14 flex items-center px-4 justify-between">
        <button onClick={() => setSidebarOpen(true)} className="text-sidebar-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-display font-bold text-sidebar-foreground">TESTATORO</span>
        <div className="w-6" />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-sidebar z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-sidebar-border">
                <span className="font-display font-bold text-sidebar-foreground">القائمة</span>
                <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-sidebar-border">
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/60">
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
