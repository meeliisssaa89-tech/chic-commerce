import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle, Truck, MapPin, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderByNumber } from "@/hooks/useSupabaseData";

const statusSteps = [
  { key: "pending", label: "قيد المراجعة", icon: Package },
  { key: "confirmed", label: "تم التأكيد", icon: CheckCircle },
  { key: "shipped", label: "تم الشحن", icon: Truck },
  { key: "delivered", label: "تم التوصيل", icon: MapPin },
];

const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  shipped: "text-purple-500",
  delivered: "text-green-500",
  cancelled: "text-destructive",
};

const TrackOrderPage = () => {
  const [input, setInput] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const { data: order, isLoading, error } = useOrderByNumber(orderNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderNumber(input.trim());
  };

  const currentStepIndex = order
    ? statusSteps.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="container py-8 px-4 max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold mb-2 text-center"
      >
        تتبع طلبك
      </motion.h1>
      <p className="text-muted-foreground text-center mb-8">أدخل رقم الطلب لمتابعة حالته</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="مثال: ORD-123456"
          className="h-12"
        />
        <Button type="submit" className="h-12 px-6" disabled={!input.trim()}>
          <Search className="w-4 h-4 ml-2" />
          بحث
        </Button>
      </form>

      {isLoading && <p className="text-center text-muted-foreground">جاري البحث...</p>}

      {error && orderNumber && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لم يتم العثور على طلب بهذا الرقم
          </CardContent>
        </Card>
      )}

      {order && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">رقم الطلب</p>
                  <p className="font-bold text-lg">{order.order_number}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">الإجمالي</p>
                  <p className="font-bold text-lg">{order.total} ج.م</p>
                </div>
              </div>

              {order.status === "cancelled" ? (
                <div className="flex items-center gap-2 text-destructive justify-center py-4">
                  <XCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">تم إلغاء الطلب</span>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex justify-between items-center">
                    {statusSteps.map((step, i) => {
                      const isActive = i <= currentStepIndex;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                              isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs text-center ${isActive ? "font-bold" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-5 right-[12%] left-[12%] h-0.5 bg-muted -z-10">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">تفاصيل الطلب</h3>
              <div className="space-y-3 mb-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span className="font-medium">{item.price * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>المجموع الفرعي</span><span>{order.subtotal} ج.م</span></div>
                <div className="flex justify-between"><span>الشحن</span><span>{order.shipping_cost == 0 ? "مجاني" : `${order.shipping_cost} ج.م`}</span></div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-accent"><span>الخصم</span><span>-{order.discount_amount} ج.م</span></div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TrackOrderPage;
