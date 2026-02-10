import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, Order } from "@/contexts/OrdersContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

const AdminOrders = () => {
  const { orders, updateOrder, deleteOrder } = useOrders();
  const { settings } = useSettings();
  const [filter, setFilter] = useState<Order["status"] | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter((o) => o.status === filter);

  const sortedOrders = [...filteredOrders].reverse();

  const statusOptions: Array<Order["status"]> = ["pending", "processing", "shipped", "delivered", "cancelled"];

  const statusColors: Record<Order["status"], string> = {
    pending: "bg-amber-100 text-amber-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<Order["status"], string> = {
    pending: "قيد الانتظار",
    processing: "قيد المعالجة",
    shipped: "مشحون",
    delivered: "تم التسليم",
    cancelled: "ملغى",
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrder(orderId, { status: newStatus });
    toast.success("تم تحديث حالة الطلب");
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      deleteOrder(id);
      toast.success("تم حذف الطلب");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <div className="w-48">
          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطلبات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="processing">قيد المعالجة</SelectItem>
              <SelectItem value="shipped">مشحون</SelectItem>
              <SelectItem value="delivered">تم التسليم</SelectItem>
              <SelectItem value="cancelled">ملغى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد طلبات
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right p-4 font-medium">رقم الطلب</th>
                    <th className="text-right p-4 font-medium">اسم العميل</th>
                    <th className="text-right p-4 font-medium">المبلغ</th>
                    <th className="text-right p-4 font-medium">عدد المنتجات</th>
                    <th className="text-right p-4 font-medium">الحالة</th>
                    <th className="text-right p-4 font-medium">التاريخ</th>
                    <th className="text-right p-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="p-4 font-bold text-accent">{order.id}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4 font-bold">
                        {order.total.toFixed(0)} {settings.currencySymbol}
                      </td>
                      <td className="p-4 text-center">{order.items.length}</td>
                      <td className="p-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value as Order["status"])
                          }
                        >
                          <SelectTrigger className={`w-32 ${statusColors[order.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>تفاصيل الطلب {order.id}</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  {/* Customer Info */}
                                  <div className="border rounded-lg p-4">
                                    <h3 className="font-bold mb-3">معلومات العميل</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <p className="text-xs text-muted-foreground">الاسم</p>
                                        <p className="font-medium">{selectedOrder.customerName}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                                        <p className="font-medium">{selectedOrder.customerEmail}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">الهاتف</p>
                                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">المدينة</p>
                                        <p className="font-medium">{selectedOrder.city}</p>
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <p className="text-xs text-muted-foreground">العنوان</p>
                                      <p className="font-medium">{selectedOrder.address}</p>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div className="border rounded-lg p-4">
                                    <h3 className="font-bold mb-3">المنتجات</h3>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between items-center p-2 bg-secondary/50 rounded"
                                        >
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.size && (
                                              <p className="text-xs text-muted-foreground">
                                                المقاس: {item.size}
                                              </p>
                                            )}
                                            {item.color && (
                                              <p className="text-xs text-muted-foreground">
                                                اللون: {item.color}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-bold">
                                              {item.quantity} × {item.price}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {(item.quantity * item.price).toFixed(0)}{" "}
                                              {settings.currencySymbol}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Order Summary */}
                                  <div className="border rounded-lg p-4 bg-secondary/30">
                                    <h3 className="font-bold mb-3">ملخص الطلب</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">المجموع الفرعي</span>
                                        <span className="font-medium">
                                          {selectedOrder.subtotal.toFixed(0)} {settings.currencySymbol}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">الشحن</span>
                                        <span className="font-medium">
                                          {selectedOrder.shipping.toFixed(0)} {settings.currencySymbol}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">الضريبة</span>
                                        <span className="font-medium">
                                          {selectedOrder.tax.toFixed(0)} {settings.currencySymbol}
                                        </span>
                                      </div>
                                      <div className="border-t pt-2 flex justify-between font-bold text-base">
                                        <span>الإجمالي</span>
                                        <span className="text-accent">
                                          {selectedOrder.total.toFixed(0)} {settings.currencySymbol}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status Change */}
                                  <div className="border rounded-lg p-4">
                                    <h3 className="font-bold mb-3">حالة الطلب</h3>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) =>
                                        handleStatusChange(selectedOrder.id, value as Order["status"])
                                      }
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {statusOptions.map((status) => (
                                          <SelectItem key={status} value={status}>
                                            {statusLabels[status]}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Notes */}
                                  {selectedOrder.notes && (
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                      <h3 className="font-bold mb-2 text-blue-900">ملاحظات</h3>
                                      <p className="text-blue-800">{selectedOrder.notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOrders;
