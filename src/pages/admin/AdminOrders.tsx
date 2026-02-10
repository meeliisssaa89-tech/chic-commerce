import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminOrders = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الطلبات</h1>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          لا توجد طلبات بعد
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
