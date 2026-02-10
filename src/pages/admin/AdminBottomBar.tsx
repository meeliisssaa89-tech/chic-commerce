import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useBottomBar, BottomBarSection } from "@/contexts/BottomBarContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminBottomBar = () => {
  const { sections, updateSection, removeSection, addSection } = useBottomBar();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name_ar: "", slug: "" });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSection = () => {
    if (!formData.name_ar.trim() || !formData.slug.trim()) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    const newSection: BottomBarSection = {
      id: Date.now().toString(),
      name_ar: formData.name_ar,
      slug: formData.slug,
      isVisible: true,
    };

    addSection(newSection);
    setFormData({ name_ar: "", slug: "" });
    setShowForm(false);
    toast.success("تم إضافة القسم بنجاح");
  };

  const handleRemoveSection = (id: string) => {
    removeSection(id);
    toast.success("تم حذف القسم بنجاح");
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    updateSection(id, !isVisible);
    toast.success(
      !isVisible ? "تم إظهار القسم" : "تم إخفاء القسم"
    );
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة أقسام البار السفلي</h1>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة قسم
            </Button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/50 rounded-lg p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسم القسم بالعربية
                </label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => handleChange("name_ar", e.target.value)}
                  placeholder="مثال: أحذية"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  الرابط (slug)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="مثال: shoes"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddSection}
                className="bg-accent"
              >
                حفظ القسم
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name_ar: "", slug: "" });
                }}
                variant="outline"
              >
                إلغاء
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-4 font-bold">اسم القسم</th>
                <th className="text-right p-4 font-bold">الرابط</th>
                <th className="text-center p-4 font-bold">الحالة</th>
                <th className="text-center p-4 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <motion.tr
                  key={section.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4">{section.name_ar}</td>
                  <td className="p-4 text-muted-foreground" dir="ltr">
                    {section.slug}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        section.isVisible
                          ? "bg-accent/20 text-accent"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {section.isVisible ? "ظاهر" : "مخفي"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleToggleVisibility(section.id, section.isVisible)
                        }
                        className="p-2 rounded hover:bg-secondary transition-colors"
                        title={
                          section.isVisible ? "إخفاء" : "إظهار"
                        }
                      >
                        {section.isVisible ? (
                          <Eye className="w-4 h-4 text-accent" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveSection(section.id)}
                        className="p-2 rounded hover:bg-destructive/10 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد أقسام. أضف قسماً للبدء!
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
      >
        <p className="text-sm text-blue-600 font-medium">
          💡 معلومة: الأقسام المخفية لن تظهر في القسم السفلي من الموقع الأمامي
        </p>
      </motion.div>
    </div>
  );
};

export default AdminBottomBar;
