import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAdminProducts, useAdminCategories, uploadImage } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductForm {
  name: string;
  name_ar: string;
  slug: string;
  price: number;
  discount_price: number | null;
  description: string;
  description_ar: string;
  category_id: string;
  sizes: string;
  colors: string;
  stock: number;
  active: boolean;
  featured: boolean;
  images: string[];
}

const emptyForm: ProductForm = {
  name: "", name_ar: "", slug: "", price: 0, discount_price: null,
  description: "", description_ar: "", category_id: "", sizes: "", colors: "",
  stock: 0, active: true, featured: false, images: [],
};

const AdminProducts = () => {
  const { data: products = [] } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name, name_ar: p.name_ar, slug: p.slug,
      price: p.price, discount_price: p.discount_price,
      description: p.description || "", description_ar: p.description_ar || "",
      category_id: p.category_id || "", sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "), stock: p.stock,
      active: p.active, featured: p.featured, images: p.images || [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage("product-images", file);
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      } catch (err: any) {
        toast({ title: "خطأ في رفع الصورة", description: err.message, variant: "destructive" });
      }
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name, name_ar: form.name_ar,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      price: form.price, discount_price: form.discount_price || null,
      description: form.description || null, description_ar: form.description_ar || null,
      category_id: form.category_id || null,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : [],
      stock: form.stock, active: form.active, featured: form.featured,
      images: form.images,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "تم تحديث المنتج" : "تم إضافة المنتج" });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setDialogOpen(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم حذف المنتج" });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Button>
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
                  <th className="text-right p-4 font-medium">المخزون</th>
                  <th className="text-right p-4 font-medium">الحالة</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any, i: number) => (
                  <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0] || "/placeholder.svg"} alt="" className="w-10 h-10 rounded bg-secondary object-cover" />
                        <div>
                          <span className="font-medium block">{product.name_ar}</span>
                          {product.featured && <span className="text-xs text-accent">مميز</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.categories?.name_ar || "—"}</td>
                    <td className="p-4">
                      {product.discount_price ? (
                        <div>
                          <span className="font-bold">{product.discount_price} ج.م</span>
                          <span className="text-muted-foreground line-through text-xs mr-2">{product.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold">{product.price} ج.م</span>
                      )}
                    </td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.active ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-12">لا توجد منتجات — أضف منتجاً جديداً</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم بالعربية *</label>
                <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الاسم بالإنجليزية *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرابط (slug)</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="يتم إنشاؤه تلقائياً" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">السعر *</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">سعر الخصم</label>
                <Input type="number" value={form.discount_price || ""} onChange={(e) => setForm({ ...form, discount_price: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المخزون</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الفئة</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm"
              >
                <option value="">— بدون فئة —</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name_ar}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">المقاسات (مفصولة بفاصلة)</label>
              <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="40, 41, 42, 43" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الألوان (مفصولة بفاصلة)</label>
              <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="أسود, بني, عسلي" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف بالعربية</label>
              <textarea
                value={form.description_ar}
                onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-sm"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">الصور</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border border-border overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-1 hover:border-accent transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">رفع</span>
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                نشط
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                مميز
              </label>
            </div>

            <Button onClick={handleSave} disabled={saving || !form.name_ar || !form.name} className="w-full">
              {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
