import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useAdminBanners, uploadImage } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BannerForm {
  title: string; title_ar: string; subtitle: string; subtitle_ar: string;
  link: string; image_url: string; sort_order: number; active: boolean;
}

const emptyForm: BannerForm = {
  title: "", title_ar: "", subtitle: "", subtitle_ar: "",
  link: "", image_url: "", sort_order: 0, active: true,
};

const AdminBanners = () => {
  const { data: banners = [] } = useAdminBanners();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (b: any) => {
    setEditingId(b.id);
    setForm({ title: b.title || "", title_ar: b.title_ar || "", subtitle: b.subtitle || "", subtitle_ar: b.subtitle_ar || "", link: b.link || "", image_url: b.image_url, sort_order: b.sort_order, active: b.active });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage("banner-images", file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!form.image_url) { toast({ title: "يرجى رفع صورة", variant: "destructive" }); return; }
    setSaving(true);
    let error;
    if (editingId) {
      ({ error } = await supabase.from("banners").update(form).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("banners").insert(form));
    }
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: editingId ? "تم التحديث" : "تم الإضافة" }); queryClient.invalidateQueries({ queryKey: ["admin", "banners"] }); setDialogOpen(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحذف" }); queryClient.invalidateQueries({ queryKey: ["admin", "banners"] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة البانرات</h1>
        <Button className="gap-2" onClick={openCreate}><Plus className="w-4 h-4" />إضافة بانر</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner: any, i: number) => (
          <motion.div key={banner.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="overflow-hidden">
              <div className="h-40 bg-secondary bg-cover bg-center" style={{ backgroundImage: `url(${banner.image_url})` }} />
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{banner.title_ar || "بدون عنوان"}</h3>
                    <p className="text-sm text-muted-foreground">{banner.subtitle_ar}</p>
                    <span className={`text-xs mt-1 inline-block ${banner.active ? "text-green-600" : "text-red-500"}`}>
                      {banner.active ? "نشط" : "معطل"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(banner.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {banners.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">لا توجد بانرات — أضف بانر جديد</CardContent></Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle>{editingId ? "تعديل البانر" : "إضافة بانر"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">صورة البانر *</label>
              {form.image_url ? (
                <div className="relative h-32 rounded bg-secondary bg-cover bg-center mb-2" style={{ backgroundImage: `url(${form.image_url})` }}>
                  <button onClick={() => setForm({ ...form, image_url: "" })} className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded p-1 text-xs">تغيير</button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full h-32 border-2 border-dashed border-border rounded flex items-center justify-center gap-2 hover:border-accent transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">رفع صورة</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div><label className="block text-sm font-medium mb-1">العنوان بالعربية</label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">النص الفرعي بالعربية</label><Input value={form.subtitle_ar} onChange={(e) => setForm({ ...form, subtitle_ar: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">الرابط</label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/category/shoes" /></div>
            <div><label className="block text-sm font-medium mb-1">الترتيب</label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />نشط</label>
            <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "جاري الحفظ..." : "حفظ"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBanners;
