import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useAdminCategories, uploadImage } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryForm {
  name: string; name_ar: string; slug: string; image_url: string; sort_order: number; active: boolean;
}

const emptyForm: CategoryForm = { name: "", name_ar: "", slug: "", image_url: "", sort_order: 0, active: true };

const AdminCategories = () => {
  const { data: categories = [] } = useAdminCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({ name: c.name, name_ar: c.name_ar, slug: c.slug, image_url: c.image_url || "", sort_order: c.sort_order, active: c.active });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage("category-images", file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!form.name_ar || !form.name) { toast({ title: "يرجى إدخال الاسم", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"), image_url: form.image_url || null };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("categories").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("categories").insert(payload));
    }
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: editingId ? "تم التحديث" : "تم الإضافة" }); queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }); setDialogOpen(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحذف" }); queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الفئات</h1>
        <Button className="gap-2" onClick={openCreate}><Plus className="w-4 h-4" />إضافة فئة</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat: any, i: number) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="overflow-hidden">
              <div className="h-32 bg-secondary bg-cover bg-center" style={{ backgroundImage: `url(${cat.image_url || "/placeholder.svg"})` }} />
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{cat.name_ar}</h3>
                    <p className="text-xs text-muted-foreground">{cat.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {categories.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">لا توجد فئات — أضف فئة جديدة</CardContent></Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle>{editingId ? "تعديل الفئة" : "إضافة فئة"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">الاسم بالعربية *</label><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">الاسم بالإنجليزية *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">الرابط (slug)</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="يتم إنشاؤه تلقائياً" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">صورة الفئة</label>
              {form.image_url ? (
                <div className="relative h-24 rounded bg-secondary bg-cover bg-center mb-2" style={{ backgroundImage: `url(${form.image_url})` }}>
                  <button onClick={() => setForm({ ...form, image_url: "" })} className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded p-1 text-xs">تغيير</button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full h-24 border-2 border-dashed border-border rounded flex items-center justify-center gap-2 hover:border-accent transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">رفع صورة</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div><label className="block text-sm font-medium mb-1">الترتيب</label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />نشط</label>
            <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "جاري الحفظ..." : "حفظ"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
