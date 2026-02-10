import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useOrders } from "@/contexts/OrdersContext";
import { usePaymentMethods } from "@/contexts/PaymentMethodsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { settings } = useSettings();
  const { addOrder } = useOrders();
  const { getActivePaymentMethods } = usePaymentMethods();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    name: "", 
    email: "",
    phone: "", 
    address: "", 
    city: "", 
    promo: "",
    paymentMethod: ""
  });
  const [submitted, setSubmitted] = useState(false);
  
  const paymentMethods = getActivePaymentMethods();
  
  const shippingCost = totalPrice >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const tax = Math.round((totalPrice * settings.taxRate) / 100);
  const grandTotal = totalPrice + shippingCost + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.paymentMethod) {
      toast.error("يرجى اختيار طريقة دفع");
      return;
    }
    
    // Create order
    addOrder({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      address: form.address,
      city: form.city,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      subtotal: totalPrice,
      shipping: shippingCost,
      tax: tax,
      total: grandTotal,
      status: "pending",
      notes: form.promo ? `كود الخصم: ${form.promo}` : undefined,
    });
    
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
        <p className="text-muted-foreground mb-4">
          رقم الطلب سيتم إرساله عبر البريد الإلكتروني والرسائل النصية
        </p>
        <p className="text-muted-foreground mb-8">
          شكراً لك، سيتم التواصل معك قريباً لتأكيد الطلب
        </p>
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
          {/* Customer Info */}
          <div className="bg-secondary/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-sm mb-3">معلومات العميل</h3>
            <div className="space-y-3">
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
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
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
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-secondary/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-sm mb-3">عنوان التسليم</h3>
            <div className="space-y-3">
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
            </div>
          </div>

          {/* Payment Methods */}
          {paymentMethods.length > 0 && (
            <div className="bg-secondary/30 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-sm mb-3">طريقة الدفع</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent/10 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      required
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-medium text-sm">{method.nameAr}</span>
                      </div>
                      {method.descriptionAr && (
                        <p className="text-xs text-muted-foreground">{method.descriptionAr}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              
              {form.paymentMethod && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900"
                >
                  {paymentMethods.find(m => m.id === form.paymentMethod)?.instructionsAr}
                </motion.div>
              )}
            </div>
          )}

          {/* Promo Code */}
          <div>
            <label className="block text-sm font-medium mb-1">كود الخصم (اختياري)</label>
            <Input
              value={form.promo}
              onChange={(e) => setForm({ ...form, promo: e.target.value })}
              placeholder="أدخل كود الخصم"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-charcoal text-cream hover:bg-accent hover:text-accent-foreground font-bold text-base mt-6">
            تأكيد الطلب — {grandTotal} {settings.currencySymbol}
          </Button>
        </motion.form>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-fit"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between text-sm p-2 bg-secondary/30 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.size && <p className="text-xs text-muted-foreground">المقاس: {item.size}</p>}
                      {item.color && <p className="text-xs text-muted-foreground">اللون: {item.color}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} × {item.price} {settings.currencySymbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.price * item.quantity} {settings.currencySymbol}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice} {settings.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الضريبة ({settings.taxRate}%)</span>
                  <span>{tax} {settings.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الشحن</span>
                  <span>{shippingCost === 0 ? "مجاني" : `${shippingCost} ${settings.currencySymbol}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>الإجمالي</span>
                  <span className="text-accent">{grandTotal} {settings.currencySymbol}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
