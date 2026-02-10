import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminBanners = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة البانرات</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة بانر
        </Button>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          لا توجد بانرات بعد — أضف بانر جديد للسلايدر الرئيسي
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBanners;
