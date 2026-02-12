import { Link } from "react-router-dom";
import { useSiteSettings, useCategories } from "@/hooks/useSupabaseData";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();

  const storeName = settings?.store_name || "TESTATORO";
  const storePhone = settings?.store_phone || "";
  const storeEmail = settings?.store_email || "";

  return (
    <footer className="bg-charcoal text-cream py-12 pb-24 lg:pb-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">{storeName}</h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              نقدم لكم أفخر المنتجات المصنوعة من أجود الخامات.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              {categories?.slice(0, 4).map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="text-cream/70 hover:text-accent transition-colors text-sm">
                  {cat.name_ar}
                </Link>
              ))}
              <Link to="/contact" className="text-cream/70 hover:text-accent transition-colors text-sm">تواصل معنا</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            {storePhone && <p className="text-cream/70 text-sm">هاتف: {storePhone}</p>}
            {storeEmail && <p className="text-cream/70 text-sm mt-1">البريد: {storeEmail}</p>}
          </div>
        </div>
        <div className="border-t border-cream/10 mt-8 pt-6 text-center text-cream/50 text-xs">
          © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;