import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "خطأ", description: "لم يتم العثور على المستخدم", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      toast({ title: "غير مصرح", description: "ليس لديك صلاحيات المسؤول", variant: "destructive" });
      setLoading(false);
      return;
    }

    navigate("/admin");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-8 rounded-lg shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">TESTATORO</h1>
          <p className="text-muted-foreground">لوحة تحكم المسؤول</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@testatoro.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">كلمة المرور</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
