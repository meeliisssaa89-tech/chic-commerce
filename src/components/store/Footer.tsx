import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream py-12 pb-24 lg:pb-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">TESTATORO</h3>
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
            <p className="text-cream/70 text-sm">هاتف: +966 50 000 0000</p>
            <p className="text-cream/70 text-sm mt-1">البريد: info@testatoro.com</p>
          </div>
        </div>
        <div className="border-t border-cream/10 mt-8 pt-6 text-center text-cream/50 text-xs">
          © 2026 TESTATORO. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
