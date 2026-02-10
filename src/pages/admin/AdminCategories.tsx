import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  image_url: string;
  description?: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Shoes", name_ar: "أحذية", slug: "shoes", image_url: "/placeholder.svg" },
    { id: "2", name: "Belts", name_ar: "أحزمة", slug: "belts", image_url: "/placeholder.svg" },
    { id: "3", name: "Wallets", name_ar: "محافظ", slug: "wallets", image_url: "/placeholder.svg" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Category, "id"> | null>(null);

  const defaultFormData: Omit<Category, "id"> = {
    name: "",
    name_ar: "",
    slug: "",
    image_url: "/placeholder.svg",
    description: "",
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData(category);
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
    if (!formData.name_ar || !formData.slug) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
      toast.success("تم تحديث الفئة بنجاح");
    } else {
      setCategories((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now().toString(),
        },
      ]);
      toast.success("تم إضافة الفئة بنجاح");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("تم حذف الفئة بنجاح");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الفئات</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة فئة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل الفئة" : "إضافة فئة جديدة"}
              </DialogTitle>
            </DialogHeader>
            {formData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اسم الفئة (عربي)
                    </label>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, name_ar: e.target.value })
                      }
                      placeholder="اسم الفئة بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اسم الفئة (إنجليزي)
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Category name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">السلاج</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="category-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">صورة الفئة</label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(value) =>
                      setFormData({ ...formData, image_url: value })
                    }
                    label=""
                    maxSizeMB={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الوصف (اختياري)
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-input rounded-md"
                    rows={3}
                    placeholder="وصف الفئة"
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

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد فئات بعد
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-secondary overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name_ar}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1">{category.name_ar}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {category.slug}
                  </p>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
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

export default AdminCategories;
