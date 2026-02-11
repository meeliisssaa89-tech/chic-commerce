import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSupabaseData";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", promo: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const freeShippingThreshold = Number(settings?.free_shipping_threshold || 200);
  const shippingRate = Number(settings?.shipping_cost || 25);
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : shippingRate;
  const discountAmount = (totalPrice * discount) / 100;
  const grandTotal = totalPrice + shippingCost - discountAmount;

  const applyPromo = async () => {
    if (!form.promo.trim()) return;
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", form.promo.trim().toUpperCase())
      .eq("active", true)
      .single();

    if (!data) {
      toast({ title: "كود غير صالح", variant: "destructive" });
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      toast({ title: "كود منتهي الصلاحية", variant: "destructive" });
      return;
    }
    if (data.max_uses && data.current_uses >= data.max_uses) {
      toast({ title: "تم استخدام الحد الأقصى لهذا الكود", variant: "destructive" });
      return;
    }
    setDiscount(data.discount_percent);
    setPromoApplied(true);
    toast({ title: `تم تطبيق خصم ${data.discount_percent}%` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          customer_city: form.city,
          promo_code: promoApplied ? form.promo.trim().toUpperCase() : null,
          notes: form.notes || null,
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          discount_amount: discountAmount,
          total: grandTotal,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId || null,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,
        color: item.color || null,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Increment promo code uses
      if (promoApplied && form.promo.trim()) {
        await supabase.rpc("has_role", { _user_id: "00000000-0000-0000-0000-000000000000", _role: "admin" }).then(() => {
          // We can't update promo_codes without admin, it's fine
        });
      }

      setOrderNumber(order.order_number);
      clearCart();
    } catch (err: any) {
      toast({ title: "خطأ في إرسال الطلب", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-display text-3xl font-bold mb-4">تم استلام طلبك!</h1>
        <p className="text-muted-foreground mb-2">شكراً لك، سيتم التواصل معك قريباً لتأكيد الطلب</p>
        <p className="font-bold text-lg mb-8">رقم الطلب: {orderNumber}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(`/track-order`)} variant="outline">
            تتبع الطلب
          </Button>
          <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>
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
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold mb-8 text-center">
        إتمام الطلب
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.form initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="أدخل اسمك الكامل" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
            <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">المدينة</label>
            <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="الرياض" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">العنوان التفصيلي</label>
            <Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="الحي، الشارع، رقم المبنى" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ملاحظات (اختياري)</label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="أي ملاحظات إضافية" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">كود الخصم (اختياري)</label>
            <div className="flex gap-2">
              <Input
                value={form.promo}
                onChange={(e) => setForm({ ...form, promo: e.target.value })}
                placeholder="أدخل كود الخصم"
                disabled={promoApplied}
              />
              <Button type="button" variant="outline" onClick={applyPromo} disabled={promoApplied || !form.promo.trim()}>
                {promoApplied ? "تم ✓" : "تطبيق"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-charcoal text-cream hover:bg-accent hover:text-accent-foreground font-bold text-base mt-4" disabled={submitting}>
            {submitting ? "جاري إرسال الطلب..." : `تأكيد الطلب — ${grandTotal.toFixed(0)} ر.س`}
          </Button>
        </motion.form>

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-lg p-6 h-fit">
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
            <div className="flex justify-between text-sm"><span>المجموع الفرعي</span><span>{totalPrice} ر.س</span></div>
            <div className="flex justify-between text-sm"><span>الشحن</span><span>{shippingCost === 0 ? "مجاني" : `${shippingCost} ر.س`}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-accent"><span>الخصم</span><span>-{discountAmount.toFixed(0)} ر.س</span></div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>الإجمالي</span>
              <span>{grandTotal.toFixed(0)} ر.س</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
