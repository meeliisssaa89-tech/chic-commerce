import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/contexts/OrdersContext";
import { useSettings } from "@/contexts/SettingsContext";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { settings } = useSettings();
  
  const [order, setOrder] = useState<any>(null);
  const orderId = (location.state as any)?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    // Find the order by ID
    const foundOrder = orders.find((o) => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orderId, orders, navigate]);

  if (!order) {
    return (
      <div className="container py-16 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل تفاصيل طلبك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Success Message */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <CheckCircle className="w-24 h-24 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">شكراً لك!</h1>
          <p className="text-xl text-muted-foreground">
            تم استلام طلبك بنجاح وسيتم معالجته قريباً
          </p>
        </div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg border border-border p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">تفاصيل طلبك</h2>

          <div className="space-y-6 mb-8">
            {/* Order ID & Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">رقم الطلب</p>
                <p className="text-xl font-bold">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">حالة الطلب</p>
                <span className="inline-block px-4 py-1 rounded-full bg-yellow-100 text-yellow-900 font-medium">
                  قيد الانتظار
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t border-border pt-6">
              <h3 className="font-bold mb-4">معلومات التسليم</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">الاسم</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">الهاتف</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">البريد الإلكتروني</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">المدينة</p>
                  <p className="font-medium">{order.city}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">العنوان</p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>

            {/* Products */}
            <div className="border-t border-border pt-6">
              <h3 className="font-bold mb-4">المنتجات المطلوبة</h3>
              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-secondary/30 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.size && `المقاس: ${item.size}`}
                        {item.size && item.color && " • "}
                        {item.color && `اللون: ${item.color}`}
                      </p>
                      <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold">
                      {item.quantity * item.price} {settings.currencySymbol}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{order.subtotal} {settings.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الضريبة</span>
                  <span>{order.tax} {settings.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الشحن</span>
                  <span>{order.shipping} {settings.currencySymbol}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span>الإجمالي</span>
                  <span className="text-accent">{order.total} {settings.currencySymbol}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-3">ما هي الخطوات القادمة؟</h3>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>سيتم معالجة طلبك خلال 24 ساعة</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>ستتلقى تأكيداً بالبريد الإلكتروني عند شحن الطلب</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>يمكنك تتبع طلبك من خلال قسم "طلباتي"</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex-1"
            >
              العودة للرئيسية
            </Button>
            <Button
              onClick={() => navigate("/my-orders")}
              className="flex-1"
            >
              تتبع طلبك
            </Button>
          </div>
        </motion.div>

        {/* Support Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground"
        >
          <p>
            إذا كان لديك أي أسئلة، يرجى{" "}
            <a href="/contact" className="text-accent hover:underline">
              التواصل معنا
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
