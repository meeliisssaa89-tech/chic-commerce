import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";

const AdminProducts = () => {
  const [products] = useState(mockProducts);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-4 font-medium">المنتج</th>
                  <th className="text-right p-4 font-medium">الفئة</th>
                  <th className="text-right p-4 font-medium">السعر</th>
                  <th className="text-right p-4 font-medium">المخزون</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded bg-secondary object-cover" />
                        <span className="font-medium">{product.name_ar}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category_ar}</td>
                    <td className="p-4">
                      {product.discount_price ? (
                        <div>
                          <span className="font-bold">{product.discount_price} ر.س</span>
                          <span className="text-muted-foreground line-through text-xs mr-2">{product.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold">{product.price} ر.س</span>
                      )}
                    </td>
                    <td className="p-4">—</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
