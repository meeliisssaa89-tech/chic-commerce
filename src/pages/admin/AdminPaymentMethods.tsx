import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X, Save, ToggleLeft, ToggleRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaymentMethods, PaymentMethod } from "@/contexts/PaymentMethodsContext";
import { toast } from "sonner";

const AdminPaymentMethods = () => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } =
    usePaymentMethods();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, "id"> | null>(null);

  const defaultFormData: Omit<PaymentMethod, "id"> = {
    name: "",
    nameAr: "",
    icon: "💳",
    description: "",
    descriptionAr: "",
    isActive: true,
    type: "custom",
    instructions: "",
    instructionsAr: "",
  };

  const paymentTypes: Array<PaymentMethod["type"]> = ["card", "transfer", "cash", "wallet", "custom"];
  const typeLabels: Record<PaymentMethod["type"], string> = {
    card: "بطاقة ائتمان",
    transfer: "تحويل بنكي",
    cash: "الدفع عند الاستلام",
    wallet: "محفظة رقمية",
    custom: "مخصص",
  };

  const commonIcons = ["💳", "🏦", "💰", "📱", "💎", "🔐", "✅", "⭐"];

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setEditingId(method.id);
      setFormData(method);
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

    if (!formData.name || !formData.nameAr) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (editingId) {
      updatePaymentMethod(editingId, formData);
      toast.success("تم تحديث طريقة الدفع بنجاح");
    } else {
      addPaymentMethod(formData);
      toast.success("تم إضافة طريقة دفع جديدة بنجاح");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف طريقة الدفع هذه؟")) {
      deletePaymentMethod(id);
      toast.success("تم حذف طريقة الدفع بنجاح");
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updatePaymentMethod(id, { isActive: !isActive });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة طرق الدفع</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة طريقة دفع
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل طريقة الدفع" : "إضافة طريقة دفع جديدة"}
              </DialogTitle>
            </DialogHeader>
            {formData && (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الاسم (عربي)
                    </label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      placeholder="اسم طريقة الدفع"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الاسم (إنجليزي)
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Payment Method Name"
                    />
                  </div>
                </div>

                {/* Type & Icon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">النوع</label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          type: value as PaymentMethod["type"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {typeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الأيقونة</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {commonIcons.map((icon) => (
                          <button
                            key={icon}
                            onClick={() =>
                              setFormData({ ...formData, icon })
                            }
                            className={`text-2xl p-2 rounded border-2 transition-colors ${
                              formData.icon === icon
                                ? "border-accent bg-accent/10"
                                : "border-input hover:border-accent"
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                      <Input
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        placeholder="أدخل رموز يونيكود أو نصوص أخرى"
                        className="text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الوصف (عربي)
                    </label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionAr: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-input rounded-md text-sm"
                      rows={3}
                      placeholder="وصف طريقة الدفع"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الوصف (إنجليزي)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-input rounded-md text-sm"
                      rows={3}
                      placeholder="Payment method description"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      التعليمات (عربي)
                    </label>
                    <textarea
                      value={formData.instructionsAr || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructionsAr: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-input rounded-md text-sm"
                      rows={3}
                      placeholder="تعليمات استخدام طريقة الدفع"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      التعليمات (إنجليزي)
                    </label>
                    <textarea
                      value={formData.instructions || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructions: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-input rounded-md text-sm"
                      rows={3}
                      placeholder="Payment method instructions"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                    تفعيل هذه الطريقة
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
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

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد طرق دفع بعد
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method, i) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`overflow-hidden ${!method.isActive ? "opacity-60" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <h3 className="font-bold">{method.nameAr}</h3>
                        <p className="text-xs text-muted-foreground">
                          {typeLabels[method.type]}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(method.id, method.isActive)}
                      className={`p-2 rounded transition-colors ${
                        method.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {method.isActive ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {method.descriptionAr && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {method.descriptionAr}
                    </p>
                  )}

                  {method.instructionsAr && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4">
                      <p className="text-xs text-blue-900">
                        <strong>التعليمات:</strong> {method.instructionsAr}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(method)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-destructive"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentMethods;
