import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminSettings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات المتجر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">نص شريط الإعلان</label>
              <Input defaultValue="شحن مجاني للطلبات فوق 200 ريال" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رسوم الشحن (ر.س)</label>
              <Input type="number" defaultValue="25" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">حد الشحن المجاني (ر.س)</label>
              <Input type="number" defaultValue="200" />
            </div>
            <Button>حفظ الإعدادات</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
