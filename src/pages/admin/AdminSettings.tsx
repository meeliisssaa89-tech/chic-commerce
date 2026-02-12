import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSupabaseData";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

const AdminSettings = () => {
  const { data: settings } = useSiteSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    announcement_text: "",
    shipping_cost: "25",
    free_shipping_threshold: "200",
    whatsapp_number: "",
    store_name: "",
    store_email: "",
    store_phone: "",
  });

  // Payment methods
  const { data: paymentMethods } = useQuery({
    queryKey: ["admin", "payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [newPayment, setNewPayment] = useState({ name: "", name_ar: "", description: "" });
  const [addingPayment, setAddingPayment] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm((prev) => ({
        ...prev,
        announcement_text: settings.announcement_text || prev.announcement_text,
        shipping_cost: settings.shipping_cost || prev.shipping_cost,
        free_shipping_threshold: settings.free_shipping_threshold || prev.free_shipping_threshold,
        whatsapp_number: settings.whatsapp_number || prev.whatsapp_number,
        store_name: settings.store_name || prev.store_name,
        store_email: settings.store_email || prev.store_email,
        store_phone: settings.store_phone || prev.store_phone,
      }));
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(form);
      const promises = entries.map(([key, value]) =>
        supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" })
      );
      const results = await Promise.all(promises);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;

      toast({ title: "تم حفظ الإعدادات بنجاح ✓" });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const addPaymentMethod = async () => {
    if (!newPayment.name_ar.trim()) return;
    setAddingPayment(true);
    try {
      const { error } = await supabase.from("payment_methods").insert({
        name: newPayment.name || newPayment.name_ar,
        name_ar: newPayment.name_ar,
        description: newPayment.description || null,
        sort_order: (paymentMethods?.length || 0) + 1,
      });
      if (error) throw error;
      setNewPayment({ name: "", name_ar: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["admin", "payment_methods"] });
      toast({ title: "تم إضافة طريقة الدفع" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setAddingPayment(false);
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin", "payment_methods"] });
      toast({ title: "تم حذف طريقة الدفع" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const togglePaymentMethod = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase.from("payment_methods").update({ active: !active }).eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin", "payment_methods"] });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>معلومات المتجر</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">اسم المتجر</label><Input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">البريد الإلكتروني</label><Input value={form.store_email} onChange={(e) => setForm({ ...form, store_email: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">رقم الهاتف</label><Input value={form.store_phone} onChange={(e) => setForm({ ...form, store_phone: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">رقم الواتساب</label><Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="966500000000" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>إعدادات المتجر</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">نص شريط الإعلان</label><Input value={form.announcement_text} onChange={(e) => setForm({ ...form, announcement_text: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">رسوم الشحن</label><Input type="number" value={form.shipping_cost} onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">حد الشحن المجاني</label><Input type="number" value={form.free_shipping_threshold} onChange={(e) => setForm({ ...form, free_shipping_threshold: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>

        <Card>
          <CardHeader><CardTitle>طرق الدفع</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods?.map((pm) => (
              <div key={pm.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{pm.name_ar}</p>
                  {pm.description && <p className="text-sm text-muted-foreground">{pm.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={pm.active ? "default" : "outline"}
                    onClick={() => togglePaymentMethod(pm.id, pm.active)}
                  >
                    {pm.active ? "مفعّل" : "معطّل"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deletePaymentMethod(pm.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-sm font-medium">إضافة طريقة دفع جديدة</p>
              <Input
                placeholder="اسم طريقة الدفع بالعربي"
                value={newPayment.name_ar}
                onChange={(e) => setNewPayment({ ...newPayment, name_ar: e.target.value })}
              />
              <Input
                placeholder="اسم طريقة الدفع بالإنجليزي (اختياري)"
                value={newPayment.name}
                onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
              />
              <Input
                placeholder="وصف (اختياري)"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
              />
              <Button onClick={addPaymentMethod} disabled={addingPayment || !newPayment.name_ar.trim()} className="w-full">
                <Plus className="w-4 h-4 ml-2" />
                {addingPayment ? "جاري الإضافة..." : "إضافة طريقة دفع"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;