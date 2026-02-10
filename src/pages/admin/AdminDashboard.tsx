import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrdersContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useSettings } from "@/contexts/SettingsContext";

const AdminDashboard = () => {
  const { orders, getTotalRevenue, getPendingOrdersCount } = useOrders();
  const { products } = useProducts();
  const { settings } = useSettings();

  const totalRevenue = getTotalRevenue();
  const pendingOrders = getPendingOrdersCount();
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    {
      label: "إجمالي الطلبات",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      label: "الإيرادات",
      value: `${totalRevenue.toFixed(0)} ${settings.currencySymbol}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "عدد المنتجات",
      value: products.length.toString(),
      icon: Package,
      color: "text-purple-500",
    },
    {
      label: "طلبات معلقة",
      value: pendingOrders.toString(),
      icon: TrendingUp,
      color: "text-amber-500",
    },
  ];

  const recentOrders = orders.slice(-5).reverse();

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    processing: "قيد المعالجة",
    shipped: "مشحون",
    delivered: "تم التسليم",
    cancelled: "ملغى",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
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
                    <th className="text-right p-3 font-medium">اسم العميل</th>
                    <th className="text-right p-3 font-medium">المبلغ</th>
                    <th className="text-right p-3 font-medium">الحالة</th>
                    <th className="text-right p-3 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="p-3 font-medium text-accent">{order.id}</td>
                      <td className="p-3">{order.customerName}</td>
                      <td className="p-3 font-bold">
                        {order.total.toFixed(0)} {settings.currencySymbol}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                    </motion.tr>
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
