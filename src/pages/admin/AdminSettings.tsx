import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { useSettings } from "@/contexts/SettingsContext";
import { useColorSettings } from "@/contexts/ColorSettingsContext";
import { toast } from "sonner";

const AdminSettings = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { colors, updateColors, resetColors } = useColorSettings();
  const [formData, setFormData] = useState(settings);
  const [colorData, setColorData] = useState(colors);
  const [hasChanges, setHasChanges] = useState(false);
  const [colorChanges, setColorChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "colors">("general");

  useEffect(() => {
    setFormData(settings);
    setHasChanges(false);
  }, [settings]);

  useEffect(() => {
    setColorData(colors);
    setColorChanges(false);
  }, [colors]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setColorData({ ...colorData, [colorKey]: value });
    setColorChanges(true);
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

  const handleColorSave = () => {
    updateColors(colorData);
    setColorChanges(false);
    toast.success("تم تحديث الألوان بنجاح");
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟")) {
      resetSettings();
      toast.success("تم إعادة تعيين الإعدادات");
    }
  };

  const handleColorReset = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع الألوان إلى القيم الافتراضية؟")) {
      resetColors();
      toast.success("تم إعادة تعيين الألوان");
    }
  };

  const colorSettings = [
    { key: "primary", label: "اللون الأساسي", description: "اللون الرئيسي للموقع" },
    { key: "accent", label: "لون التركيز", description: "اللون المستخدم للتركيز" },
    { key: "secondary", label: "اللون الثانوي", description: "الألوان الخلفية الثانوية" },
    { key: "background", label: "لون الخلفية", description: "لون الخلفية الرئيسي" },
    { key: "foreground", label: "لون النص", description: "اللون الأساسي للنصوص" },
    { key: "charcoal", label: "الفحم", description: "لون داكن عميق" },
    { key: "cream", label: "الكريمي", description: "لون فاتح دافئ" },
    { key: "border", label: "لون الحدود", description: "لون الحدود والفواصل" },
    { key: "muted", label: "الرمادي", description: "لون النصوص الخفيفة" },
    { key: "destructive", label: "لون التحذير", description: "لون أزرار الحذف" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إعدادات الموقع</h1>
        {(hasChanges || colorChanges) && (
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

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "general"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          الإعدادات العامة
        </button>
        <button
          onClick={() => setActiveTab("colors")}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === "colors"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette className="w-4 h-4" />
          الألوان
        </button>
      </div>

      {activeTab === "general" && (
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
                  <label className="block text-sm font-medium mb-2">اللوجو</label>
                  <ImageUpload
                    value={formData.logo}
                    onChange={(value) => handleChange("logo", value)}
                    label=""
                    maxSizeMB={2}
                  />
                </div>
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
      )}

      {activeTab === "colors" && (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>ألوان الموقع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {colorSettings.map((color, idx) => (
                    <motion.div
                      key={color.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border rounded-lg p-4"
                    >
                      <label className="block text-sm font-medium mb-2">{color.label}</label>
                      <p className="text-xs text-muted-foreground mb-3">{color.description}</p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="color"
                            value={colorData[color.key as keyof typeof colorData]}
                            onChange={(e) =>
                              handleColorChange(color.key, e.target.value)
                            }
                            className="w-full h-10 rounded border border-input cursor-pointer"
                          />
                        </div>
                        <Input
                          value={colorData[color.key as keyof typeof colorData]}
                          onChange={(e) =>
                            handleColorChange(color.key, e.target.value)
                          }
                          placeholder="#000000"
                          className="flex-1 text-sm"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>معاينة الألوان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {colorSettings.map((color) => (
                    <div
                      key={color.key}
                      className="text-center"
                    >
                      <div
                        className="w-full h-20 rounded border mb-2"
                        style={{
                          backgroundColor: colorData[color.key as keyof typeof colorData],
                        }}
                      />
                      <p className="text-xs font-medium">{color.label}</p>
                    </div>
                  ))}
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
              onClick={handleColorSave}
              disabled={!colorChanges}
              className="gap-2 flex-1 md:flex-none"
            >
              <Save className="w-4 h-4" />
              حفظ الألوان
            </Button>
            <Button
              variant="outline"
              onClick={handleColorReset}
              className="flex-1 md:flex-none"
            >
              إعادة تعيين الألوان
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
