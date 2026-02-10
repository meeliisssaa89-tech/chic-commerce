import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentMethods } from "@/contexts/PaymentMethodsContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  paymentMethodId: string;
}

const PaymentGatewayPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getPaymentMethod } = usePaymentMethods();
  const { settings } = useSettings();
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed" | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      toast.error("لم يتم العثور على بيانات الدفع");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    try {
      const decoded = JSON.parse(atob(data));
      setPaymentData(decoded);
    } catch (error) {
      toast.error("خطأ في بيانات الدفع");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [searchParams, navigate]);

  if (!paymentData) {
    return (
      <div className="container py-16 px-4 flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const paymentMethod = getPaymentMethod(paymentData.paymentMethodId);

  const handleProcessPayment = async () => {
    setProcessing(true);
    setPaymentStatus("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // For demo purposes, we simulate successful payment
    // In real scenario, this would call an actual payment gateway API
    const isSuccessful = Math.random() > 0.2; // 80% success rate for demo

    if (isSuccessful) {
      setPaymentStatus("success");
      toast.success("تم الدفع بنجاح!");
      
      // Store payment success in session storage for order confirmation
      sessionStorage.setItem(
        "paymentSuccess",
        JSON.stringify({
          orderId: paymentData.orderId,
          paymentMethodId: paymentData.paymentMethodId,
          amount: paymentData.amount,
          timestamp: new Date().toISOString(),
        })
      );

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate("/payment-success", { state: { orderId: paymentData.orderId } });
      }, 2000);
    } else {
      setPaymentStatus("failed");
      toast.error("فشل الدفع. حاول مرة أخرى.");
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus(null);
    setProcessing(false);
  };

  return (
    <div className="container py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">بوابة الدفع</h1>
          <p className="text-muted-foreground">
            أكمل عملية الدفع لإنهاء طلبك
          </p>
        </div>

        {/* Payment Status */}
        {paymentStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <Check className="w-16 h-16 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">تم الدفع بنجاح!</h2>
            <p className="text-green-700">جاري تحويلك إلى صفحة تأكيد الطلب...</p>
          </motion.div>
        )}

        {paymentStatus === "failed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center mb-8"
          >
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">فشلت عملية الدفع</h2>
            <p className="text-red-700 mb-6">
              حدث خطأ أثناء معالجة طلب الدفع. حاول مرة أخرى.
            </p>
          </motion.div>
        )}

        {paymentStatus === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader className="w-16 h-16 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">جاري معالجة الدفع</h2>
            <p className="text-blue-700">يرجى الانتظار...</p>
          </motion.div>
        )}

        {!paymentStatus && (
          <>
            {/* Payment Method Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg border border-border p-8 mb-8"
            >
              <h2 className="text-xl font-bold mb-6">ملخص الدفع</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">رقم الطلب:</span>
                  <span className="font-bold">{paymentData.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">اسم العميل:</span>
                  <span className="font-bold">{paymentData.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">البريد الإلكتروني:</span>
                  <span className="font-bold">{paymentData.customerEmail}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center text-lg">
                  <span className="font-bold">المبلغ المستحق:</span>
                  <span className="text-accent font-bold text-2xl">
                    {paymentData.amount} {paymentData.currency}
                  </span>
                </div>
              </div>

              {/* Payment Method Details */}
              {paymentMethod && (
                <div className="bg-secondary/30 rounded-lg p-6 mb-8">
                  <h3 className="font-bold mb-4">طريقة الدفع</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {paymentMethod.image ? (
                      <img
                        src={paymentMethod.image}
                        alt={paymentMethod.nameAr}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <span className="text-4xl">{paymentMethod.icon}</span>
                    )}
                    <div>
                      <p className="font-bold text-lg">{paymentMethod.nameAr}</p>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethod.descriptionAr}
                      </p>
                    </div>
                  </div>

                  {paymentMethod.instructionsAr && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <p className="text-sm text-blue-900">
                        <strong>التعليمات:</strong> {paymentMethod.instructionsAr}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Form (Simulated) */}
              <div className="bg-secondary/50 rounded-lg p-6 mb-8">
                <h3 className="font-bold mb-4">معلومات الدفع</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      رقم البطاقة
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                      disabled={processing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                        disabled={processing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate("/checkout")}
                  variant="outline"
                  className="flex-1"
                  disabled={processing}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  className="flex-1"
                  disabled={processing}
                >
                  {processing ? "جاري المعالجة..." : "إتمام الدفع"}
                </Button>
              </div>
            </motion.div>
          </>
        )}

        {paymentStatus === "failed" && (
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/checkout")}
              variant="outline"
              className="flex-1"
            >
              العودة إلى السلة
            </Button>
            <Button onClick={handleRetry} className="flex-1">
              حاول مرة أخرى
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentGatewayPage;
