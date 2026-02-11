import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminOrders } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusLabels: Record<string, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

const allStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const { data: orders = [] } = useAdminOrders();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم تحديث حالة الطلب" });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الطلبات</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          الكل ({orders.length})
        </Button>
        {allStatuses.map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {statusLabels[s]} ({orders.filter((o) => o.status === s).length})
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-4 font-medium">رقم الطلب</th>
                  <th className="text-right p-4 font-medium">العميل</th>
                  <th className="text-right p-4 font-medium">الهاتف</th>
                  <th className="text-right p-4 font-medium">الإجمالي</th>
                  <th className="text-right p-4 font-medium">الحالة</th>
                  <th className="text-right p-4 font-medium">التاريخ</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order: any, i: number) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-mono text-xs">{order.order_number}</td>
                    <td className="p-4">{order.customer_name}</td>
                    <td className="p-4 text-muted-foreground">{order.customer_phone}</td>
                    <td className="p-4 font-bold">{order.total} ر.س</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-border rounded px-2 py-1 bg-background"
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString("ar-SA")}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">لا توجد طلبات</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">العميل:</span> {selectedOrder.customer_name}</div>
                <div><span className="text-muted-foreground">الهاتف:</span> {selectedOrder.customer_phone}</div>
                <div><span className="text-muted-foreground">المدينة:</span> {selectedOrder.customer_city}</div>
                <div><span className="text-muted-foreground">الحالة:</span> <Badge variant={statusVariant[selectedOrder.status]}>{statusLabels[selectedOrder.status]}</Badge></div>
              </div>
              <div className="text-sm"><span className="text-muted-foreground">العنوان:</span> {selectedOrder.customer_address}</div>
              {selectedOrder.notes && <div className="text-sm"><span className="text-muted-foreground">ملاحظات:</span> {selectedOrder.notes}</div>}

              <div className="border-t border-border pt-3">
                <h4 className="font-medium mb-2">المنتجات</h4>
                {selectedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>
                      {item.product_name} × {item.quantity}
                      {item.size && ` (${item.size})`}
                      {item.color && ` - ${item.color}`}
                    </span>
                    <span className="font-medium">{item.price * item.quantity} ر.س</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>المجموع الفرعي</span><span>{selectedOrder.subtotal} ر.س</span></div>
                <div className="flex justify-between"><span>الشحن</span><span>{selectedOrder.shipping_cost == 0 ? "مجاني" : `${selectedOrder.shipping_cost} ر.س`}</span></div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-accent"><span>الخصم ({selectedOrder.promo_code})</span><span>-{selectedOrder.discount_amount} ر.س</span></div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>الإجمالي</span><span>{selectedOrder.total} ر.س</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
