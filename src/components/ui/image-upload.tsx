import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export const ImageUpload = ({
  value,
  onChange,
  label = "رفع الصورة",
  maxSizeMB = 5,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`حجم الصورة يجب أن يكون أقل من ${maxSizeMB} ميجابايت`);
      return;
    }

    setIsLoading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onChange(base64String);
      toast.success("تم رفع الصورة بنجاح");
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast.error("حدث خطأ في رفع الصورة");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}

      {value ? (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-border rounded-lg p-4 overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full max-h-40 object-cover rounded"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onChange("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="gap-2 text-destructive w-full"
          >
            <X className="w-4 h-4" />
            إزالة الصورة
          </Button>
        </div>
      ) : (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{ backgroundColor: isDragging ? "hsl(var(--muted))" : "transparent" }}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            className="flex flex-col items-center gap-3"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                {isDragging ? "أفلت الصورة هنا" : "اسحب الصورة أو انقر للاختيار"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF - حتى {maxSizeMB} MB
              </p>
            </div>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={isLoading}
          />
        </motion.div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-4 h-4 border-2 border-muted-foreground border-t-accent rounded-full"
          />
          جاري الرفع...
        </div>
      )}
    </div>
  );
};
