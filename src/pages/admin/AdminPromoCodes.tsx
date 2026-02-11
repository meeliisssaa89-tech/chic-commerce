import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAdminPromoCodes } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PromoForm {
  code: string; discount_percent: number; max_uses: number | null; expires_at: string; active: boolean;
}

const emptyForm: PromoForm = { code: "", discount_percent: 10, max_uses: null, expires_at: "", active: true };

const AdminPromoCodes = () => {
  const { data: codes = [] } = useAdminPromoCodes();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PromoForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({ code: c.code, discount_percent: c.discount_percent, max_uses: c.max_uses, expires_at: c.expires_at ? c.expires_at.split("T")[0] : "", active: c.active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code) { toast({ title: "يرجى إدخال الكود", variant: "destructive" }); return; }
    setSaving(true);
    const payload = {
      code: form.code.toUpperCase(),
      discount_percent: form.discount_percent,
      max_uses: form.max_uses || null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      active: form.active,
    };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("promo_codes").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("promo_codes").insert(payload));
    }
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: editingId ? "تم التحديث" : "تم الإضافة" }); queryClient.invalidateQueries({ queryKey: ["admin", "promo_codes"] }); setDialogOpen(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحذف" }); queryClient.invalidateQueries({ queryKey: ["admin", "promo_codes"] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">أكواد الخصم</h1>
        <Button className="gap-2" onClick={openCreate}><Plus className="w-4 h-4" />إضافة كود</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-4 font-medium">الكود</th>
                  <th className="text-right p-4 font-medium">نسبة الخصم</th>
                  <th className="text-right p-4 font-medium">الاستخدامات</th>
                  <th className="text-right p-4 font-medium">تاريخ الانتهاء</th>
                  <th className="text-right p-4 font-medium">الحالة</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code: any, i: number) => (
                  <motion.tr key={code.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-mono font-bold">{code.code}</td>
                    <td className="p-4">{code.discount_percent}%</td>
                    <td className="p-4">{code.current_uses}{code.max_uses ? ` / ${code.max_uses}` : ""}</td>
                    <td className="p-4 text-muted-foreground">{code.expires_at ? new Date(code.expires_at).toLocaleDateString("ar-SA") : "بدون"}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${code.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {code.active ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(code)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(code.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {codes.length === 0 && <p className="text-center text-muted-foreground py-12">لا توجد أكواد خصم</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle>{editingId ? "تعديل كود الخصم" : "إضافة كود خصم"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">الكود *</label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" /></div>
            <div><label className="block text-sm font-medium mb-1">نسبة الخصم (%)</label><Input type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} /></div>
            <div><label className="block text-sm font-medium mb-1">الحد الأقصى للاستخدام (اختياري)</label><Input type="number" value={form.max_uses || ""} onChange={(e) => setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })} /></div>
            <div><label className="block text-sm font-medium mb-1">تاريخ الانتهاء (اختياري)</label><Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />نشط</label>
            <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "جاري الحفظ..." : "حفظ"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPromoCodes;
