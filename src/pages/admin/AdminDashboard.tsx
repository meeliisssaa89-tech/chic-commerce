import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "إجمالي الطلبات", value: "0", icon: ShoppingCart, color: "text-accent" },
  { label: "الإيرادات", value: "0 ر.س", icon: DollarSign, color: "text-accent" },
  { label: "المنتجات", value: "0", icon: Package, color: "text-accent" },
  { label: "طلبات معلقة", value: "0", icon: TrendingUp, color: "text-accent" },
];

const AdminDashboard = () => {
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
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
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
          <p className="text-muted-foreground text-center py-8">لا توجد طلبات بعد</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
