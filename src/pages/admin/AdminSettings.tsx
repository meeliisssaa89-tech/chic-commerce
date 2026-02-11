import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSupabaseData";
import { useQueryClient } from "@tanstack/react-query";

const AdminSettings = () => {
  const { data: settings } = useSiteSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    announcement_text: "",
    shipping_cost: "25",
    free_shipping_threshold: "200",
    whatsapp_number: "966500000000",
    store_name: "TESTATORO",
    store_email: "info@testatoro.com",
    store_phone: "+966 50 000 0000",
  });

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
      for (const [key, value] of Object.entries(form)) {
        await supabase
          .from("site_settings")
          .upsert({ key, value }, { onConflict: "key" });
      }
      toast({ title: "تم حفظ الإعدادات" });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setSaving(false);
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
            <div><label className="block text-sm font-medium mb-1">رسوم الشحن (ر.س)</label><Input type="number" value={form.shipping_cost} onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">حد الشحن المجاني (ر.س)</label><Input type="number" value={form.free_shipping_threshold} onChange={(e) => setForm({ ...form, free_shipping_threshold: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
