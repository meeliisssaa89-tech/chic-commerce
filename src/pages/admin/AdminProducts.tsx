import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProducts, Product } from "@/contexts/ProductsContext";
import { toast } from "sonner";

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id"> | null>(null);

  const defaultFormData: Omit<Product, "id"> = {
    name: "",
    name_ar: "",
    slug: "",
    price: 0,
    discount_price: null,
    category_slug: "shoes",
    category_ar: "أحذية",
    sizes: [],
    colors: [],
    images: ["/placeholder.svg"],
    featured: false,
    description_ar: "",
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData(product);
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
    if (!formData.name_ar || !formData.slug || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      toast.success("تم تحديث المنتج بنجاح");
    } else {
      addProduct(formData);
      toast.success("تم إضافة المنتج بنجاح");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProduct(id);
      toast.success("تم حذف المنتج بنجاح");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
              </DialogTitle>
            </DialogHeader>
            {formData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اسم المنتج (عربي)
                    </label>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, name_ar: e.target.value })
                      }
                      placeholder="اسم المنتج بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اسم المنتج (إنجليزي)
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Product name"
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
                    placeholder="product-slug"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="السعر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      السعر بعد الخصم (اختياري)
                    </label>
                    <Input
                      type="number"
                      value={formData.discount_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_price: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        })
                      }
                      placeholder="السعر بعد الخصم"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الفئة (عربي)
                    </label>
                    <Input
                      value={formData.category_ar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_ar: e.target.value,
                        })
                      }
                      placeholder="الفئة بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الفئة (slug)
                    </label>
                    <Input
                      value={formData.category_slug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_slug: e.target.value,
                        })
                      }
                      placeholder="category-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الألوان (مفصولة بفواصل)
                  </label>
                  <Input
                    value={formData.colors.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colors: e.target.value
                          .split(",")
                          .map((c) => c.trim()),
                      })
                    }
                    placeholder="أسود، بني، أحمر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الأحجام (مفصولة بفواصل)
                  </label>
                  <Input
                    value={formData.sizes.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sizes: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    placeholder="40، 41، 42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الوصف (عربي)
                  </label>
                  <textarea
                    value={formData.description_ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_ar: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-input rounded-md"
                    rows={4}
                    placeholder="وصف المنتج بالعربية"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    منتج مميز
                  </label>
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-4 font-medium">المنتج</th>
                  <th className="text-right p-4 font-medium">الفئة</th>
                  <th className="text-right p-4 font-medium">السعر</th>
                  <th className="text-right p-4 font-medium">مميز</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded bg-secondary object-cover"
                        />
                        <span className="font-medium">{product.name_ar}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {product.category_ar}
                    </td>
                    <td className="p-4">
                      {product.discount_price ? (
                        <div>
                          <span className="font-bold">
                            {product.discount_price} ر.س
                          </span>
                          <span className="text-muted-foreground line-through text-xs mr-2">
                            {product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold">{product.price} ر.س</span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.featured ? (
                        <span className="text-accent font-bold">نعم</span>
                      ) : (
                        <span className="text-muted-foreground">لا</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
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

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد منتجات بعد</p>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
