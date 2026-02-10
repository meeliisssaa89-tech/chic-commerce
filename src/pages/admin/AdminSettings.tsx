import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

const AdminSettings = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.siteName || !formData.siteNameAr) {
      toast.error("يرجى إدخال اسم الموقع");
      return;
    }

    updateSettings(formData);
    setHasChanges(false);
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟")) {
      resetSettings();
      toast.success("تم إعادة تعيين الإعدادات");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إعدادات الموقع</h1>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">لديك تغييرات غير محفوظة</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>معلومات الموقع الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الموقع (English)</label>
                  <Input
                    value={formData.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    placeholder="Site Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الموقع (العربية)</label>
                  <Input
                    value={formData.siteNameAr}
                    onChange={(e) => handleChange("siteNameAr", e.target.value)}
                    placeholder="اسم الموقع"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رابط اللوجو</label>
                <Input
                  value={formData.logo}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  placeholder="/logo.png"
                />
              </div>

              {formData.logo && (
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">معاينة اللوجو:</p>
                  <img src={formData.logo} alt="Logo" className="h-12 object-contain" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Currency & Payment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>العملة والدفع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">رمز العملة</label>
                  <Input
                    value={formData.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    placeholder="SAR"
                    maxLength={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رمز العملة المعروض</label>
                  <Input
                    value={formData.currencySymbol}
                    onChange={(e) => handleChange("currencySymbol", e.target.value)}
                    placeholder="ر.س"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نسبة الضريبة (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رسوم الشحن (ر.س)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.shippingCost}
                    onChange={(e) => handleChange("shippingCost", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">حد الشحن المجاني (ر.س)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => handleChange("freeShippingThreshold", parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+966501234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="info@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="العنوان الكامل"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="gap-2 flex-1 md:flex-none"
          >
            <Save className="w-4 h-4" />
            حفظ الإعدادات
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 md:flex-none"
          >
            إعادة تعيين
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
