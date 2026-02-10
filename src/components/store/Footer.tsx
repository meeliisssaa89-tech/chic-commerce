import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-charcoal text-cream py-12 pb-24 lg:pb-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt={settings.siteName} 
                  className="h-8 object-contain"
                />
              )}
              <h3 className="font-display text-2xl font-bold">{settings.siteNameAr}</h3>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              نقدم لكم أفخر المنتجات الجلدية المصنوعة يدوياً من أجود الخامات الإيطالية.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/category/shoes" className="text-cream/70 hover:text-accent transition-colors text-sm">أحذية</Link>
              <Link to="/category/belts" className="text-cream/70 hover:text-accent transition-colors text-sm">أحزمة</Link>
              <Link to="/category/wallets" className="text-cream/70 hover:text-accent transition-colors text-sm">محافظ</Link>
              <Link to="/contact" className="text-cream/70 hover:text-accent transition-colors text-sm">تواصل معنا</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <p className="text-cream/70 text-sm">
              <a href={`tel:${settings.phone}`} className="hover:text-accent transition-colors">
                هاتف: {settings.phone}
              </a>
            </p>
            <p className="text-cream/70 text-sm mt-1">
              <a href={`mailto:${settings.email}`} className="hover:text-accent transition-colors">
                البريد: {settings.email}
              </a>
            </p>
            <p className="text-cream/70 text-sm mt-1">
              العنوان: {settings.address}
            </p>
          </div>
        </div>
        <div className="border-t border-cream/10 mt-8 pt-6 text-center text-cream/50 text-xs">
          © {new Date().getFullYear()} {settings.siteNameAr}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
