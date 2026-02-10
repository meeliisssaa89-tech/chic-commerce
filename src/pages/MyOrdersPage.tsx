import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Clock, Truck, CheckCircle } from "lucide-react";
import { useOrders } from "@/contexts/OrdersContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const STATUS_CONFIG = {
  pending: {
    label: "قيد الانتظار",
    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
    icon: Clock,
  },
  processing: {
    label: "قيد المعالجة",
    color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    icon: Package,
  },
  shipped: {
    label: "تم الشحن",
    color: "bg-purple-500/10 border-purple-500/20 text-purple-600",
    icon: Truck,
  },
  delivered: {
    label: "تم التسليم",
    color: "bg-green-500/10 border-green-500/20 text-green-600",
    icon: CheckCircle,
  },
  cancelled: {
    label: "ملغاة",
    color: "bg-red-500/10 border-red-500/20 text-red-600",
    icon: Clock,
  },
};

const MyOrdersPage = () => {
  const { orders } = useOrders();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const searchResults = searchQuery.trim()
    ? orders.filter(
        (order) =>
          order.customerEmail.includes(searchQuery) ||
          order.customerPhone.includes(searchQuery) ||
          order.id.includes(searchQuery)
      )
    : [];

  const StatusIcon = STATUS_CONFIG[selectedOrder as keyof typeof STATUS_CONFIG]?.icon || Clock;

  if (!searchQuery) {
    return (
      <div className="container py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-4">تتبع طلباتك</h1>
          <p className="text-center text-muted-foreground mb-8">
            أدخل بريدك الإلكتروني أو رقم هاتفك أو رقم الطلب لمتابعة حالة طلبك
          </p>

          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البريد الإلكتروني أو رقم الهاتف أو رقم الطلب..."
                className="pr-12 h-14 text-base"
                autoFocus
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "قيد الانتظار" },
              { icon: Package, label: "قيد المعالجة" },
              { icon: Truck, label: "تم الشحن" },
              { icon: CheckCircle, label: "تم التسليم" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center p-4"
              >
                <item.icon className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedOrder(null);
              }}
              variant="outline"
            >
              ← العودة
            </Button>
            <h1 className="text-3xl font-bold">نتائج البحث</h1>
          </div>

          {searchResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/50 rounded-lg p-12 text-center"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-xl font-medium mb-2">لم نجد أي طلبات</p>
              <p className="text-muted-foreground">
                تحقق من بريدك الإلكتروني أو رقم هاتفك وحاول مرة أخرى
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((order) => {
                const config =
                  STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                const StatusIcon = config?.icon || Clock;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder === order.id ? null : order.id
                      )
                    }
                    className="bg-card rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            رقم الطلب
                          </p>
                          <h3 className="text-xl font-bold">{order.id}</h3>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${config?.color}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="font-medium">{config?.label}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            العميل
                          </p>
                          <p className="font-medium text-sm">
                            {order.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            التاريخ
                          </p>
                          <p className="font-medium text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "ar-SA"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            عدد المنتجات
                          </p>
                          <p className="font-medium text-sm">
                            {order.items.length} منتج
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            الإجمالي
                          </p>
                          <p className="font-bold text-sm text-accent">
                            {order.total} {settings.currencySymbol}
                          </p>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {selectedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border pt-6 mt-6"
                        >
                          {/* Items */}
                          <h4 className="font-bold mb-4">المنتجات</h4>
                          <div className="space-y-3 mb-6">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-start p-3 bg-secondary/30 rounded"
                              >
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.size && `المقاس: ${item.size}`}
                                    {item.size && item.color && " • "}
                                    {item.color && `اللون: ${item.color}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    الكمية: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold text-accent">
                                  {item.quantity * item.price}{" "}
                                  {settings.currencySymbol}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <h4 className="font-bold mb-4">ملخص الطلب</h4>
                          <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                المجموع الفرعي
                              </span>
                              <span className="font-medium">
                                {order.subtotal} {settings.currencySymbol}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                الضريبة
                              </span>
                              <span className="font-medium">
                                {order.tax} {settings.currencySymbol}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                الشحن
                              </span>
                              <span className="font-medium">
                                {order.shipping} {settings.currencySymbol}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                              <span>الإجمالي</span>
                              <span className="text-accent">
                                {order.total} {settings.currencySymbol}
                              </span>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <h4 className="font-bold mb-4">معلومات التسليم</h4>
                          <div className="bg-secondary/30 rounded p-4 text-sm space-y-2">
                            <p>
                              <span className="text-muted-foreground">
                                الاسم:
                              </span>{" "}
                              <span className="font-medium">
                                {order.customerName}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                الهاتف:
                              </span>{" "}
                              <span className="font-medium">
                                {order.customerPhone}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                البريد:
                              </span>{" "}
                              <span className="font-medium">
                                {order.customerEmail}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                العنوان:
                              </span>{" "}
                              <span className="font-medium">
                                {order.address}, {order.city}
                              </span>
                            </p>
                          </div>

                          {order.notes && (
                            <>
                              <h4 className="font-bold mb-4 mt-6">ملاحظات</h4>
                              <p className="text-sm text-muted-foreground bg-secondary/30 rounded p-4">
                                {order.notes}
                              </p>
                            </>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MyOrdersPage;
