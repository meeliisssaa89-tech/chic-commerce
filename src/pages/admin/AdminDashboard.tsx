import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardStats, useAdminOrders } from "@/hooks/useSupabaseData";
import { Badge } from "@/components/ui/badge";

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

const AdminDashboard = () => {
  const { data: stats } = useAdminDashboardStats();
  const { data: orders = [] } = useAdminOrders();
  const recentOrders = orders.slice(0, 10);

  const statCards = [
    { label: "إجمالي الطلبات", value: stats?.totalOrders || 0, icon: ShoppingCart },
    { label: "الإيرادات", value: `${stats?.totalRevenue?.toFixed(0) || 0} ج.م`, icon: DollarSign },
    { label: "المنتجات", value: stats?.totalProducts || 0, icon: Package },
    { label: "طلبات معلقة", value: stats?.pendingOrders || 0, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="w-5 h-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخر الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">لا توجد طلبات بعد</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right p-3 font-medium">رقم الطلب</th>
                    <th className="text-right p-3 font-medium">العميل</th>
                    <th className="text-right p-3 font-medium">الإجمالي</th>
                    <th className="text-right p-3 font-medium">الحالة</th>
                    <th className="text-right p-3 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3 font-mono text-xs">{order.order_number}</td>
                      <td className="p-3">{order.customer_name}</td>
                      <td className="p-3 font-bold">{order.total} ج.م</td>
                      <td className="p-3">
                        <Badge variant={statusVariant[order.status] || "outline"}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString("ar-SA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
