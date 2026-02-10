import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProducts, Banner } from "@/contexts/ProductsContext";
import { toast } from "sonner";

const AdminBanners = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Banner, "id"> | null>(null);

  const defaultFormData: Omit<Banner, "id"> = {
    title_ar: "",
    subtitle_ar: "",
    image_url: "/placeholder.svg",
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData(banner);
    } else {
      setEditingId(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData(null);
  };

  const handleSave = () => {
    if (!formData) return;

    // Validate form
    if (!formData.title_ar) {
      toast.error("يرجى إدخال عنوان البانر");
      return;
    }

    if (editingId) {
      updateBanner(editingId, formData);
      toast.success("تم تحديث البانر بنجاح");
    } else {
      addBanner(formData);
      toast.success("تم إضافة البانر بنجاح");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا البانر؟")) {
      deleteBanner(id);
      toast.success("تم حذف البانر بنجاح");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة البانرات</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة بانر
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل البانر" : "إضافة بانر جديد"}
              </DialogTitle>
            </DialogHeader>
            {formData && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    العنوان (عربي)
                  </label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, title_ar: e.target.value })
                    }
                    placeholder="عنوان البانر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الوصف (عربي)
                  </label>
                  <Input
                    value={formData.subtitle_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle_ar: e.target.value })
                    }
                    placeholder="وصف البانر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">صورة البانر</label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(value) =>
                      setFormData({ ...formData, image_url: value })
                    }
                    label=""
                    maxSizeMB={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    حفظ
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد بانرات بعد — أضف بانر جديد للسلايدر الرئيسي
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video bg-secondary overflow-hidden">
                  <img
                    src={banner.image_url}
                    alt={banner.title_ar}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">{banner.title_ar}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {banner.subtitle_ar}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-1"
                      onClick={() => handleOpenDialog(banner)}
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-1 text-destructive"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
