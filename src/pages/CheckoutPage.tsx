import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", promo: "" });
  const [submitted, setSubmitted] = useState(false);

  const shippingCost = totalPrice >= 200 ? 0 : 25;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container py-16 text-center"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-display text-3xl font-bold mb-4">تم استلام طلبك!</h1>
        <p className="text-muted-foreground mb-8">شكراً لك، سيتم التواصل معك قريباً لتأكيد الطلب</p>
        <Button onClick={() => navigate("/")} variant="outline">
          العودة للرئيسية
        </Button>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center text-muted-foreground">
        <p className="text-lg mb-4">السلة فارغة</p>
        <Button onClick={() => navigate("/")} variant="outline">تسوق الآن</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold mb-8 text-center"
      >
        إتمام الطلب
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
            <Input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="05XXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">المدينة</label>
            <Input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="الرياض"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">العنوان التفصيلي</label>
            <Input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="الحي، الشارع، رقم المبنى"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">كود الخصم (اختياري)</label>
            <Input
              value={form.promo}
              onChange={(e) => setForm({ ...form, promo: e.target.value })}
              placeholder="أدخل كود الخصم"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-charcoal text-cream hover:bg-accent hover:text-accent-foreground font-bold text-base mt-4">
            تأكيد الطلب — {grandTotal} ر.س
          </Button>
        </motion.form>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-lg p-6 h-fit"
        >
          <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">{item.price * item.quantity} ر.س</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>المجموع الفرعي</span>
              <span>{totalPrice} ر.س</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>الشحن</span>
              <span>{shippingCost === 0 ? "مجاني" : `${shippingCost} ر.س`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>الإجمالي</span>
              <span>{grandTotal} ر.س</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
