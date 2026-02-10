import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  isActive: boolean;
  type: "card" | "transfer" | "cash" | "wallet" | "custom";
  instructions?: string;
  instructionsAr?: string;
}

interface PaymentMethodsContextType {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  getActivePaymentMethods: () => PaymentMethod[];
  getPaymentMethod: (id: string) => PaymentMethod | undefined;
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "Credit/Debit Card",
    nameAr: "بطاقة الائتمان/الخصم",
    icon: "💳",
    description: "Pay securely with your credit or debit card",
    descriptionAr: "ادفع بأمان باستخدام بطاقتك الائتمانية أو الخصم",
    isActive: true,
    type: "card",
    instructions: "Enter your card details to complete the payment",
    instructionsAr: "أدخل بيانات بطاقتك لإتمام الدفع",
  },
  {
    id: "2",
    name: "Bank Transfer",
    nameAr: "تحويل بنكي",
    icon: "🏦",
    description: "Transfer funds directly to our bank account",
    descriptionAr: "حول الأموال مباشرة إلى حسابنا البنكي",
    isActive: true,
    type: "transfer",
    instructions: "You will receive bank details after confirming your order",
    instructionsAr: "ستتلقى تفاصيل البنك بعد تأكيد طلبك",
  },
  {
    id: "3",
    name: "Cash on Delivery",
    nameAr: "الدفع عند الاستلام",
    icon: "💰",
    description: "Pay when your order arrives",
    descriptionAr: "ادفع عند وصول طلبك",
    isActive: true,
    type: "cash",
    instructions: "Pay the delivery person when your package arrives",
    instructionsAr: "ادفع موظف التسليم عند وصول طردك",
  },
];

const PaymentMethodsContext = createContext<PaymentMethodsContextType | null>(null);

export const usePaymentMethods = () => {
  const ctx = useContext(PaymentMethodsContext);
  if (!ctx) throw new Error("usePaymentMethods must be used within PaymentMethodsProvider");
  return ctx;
};

export const PaymentMethodsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chic_commerce_payment_methods");
      if (saved) {
        setPaymentMethods(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load payment methods from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever methods change
  useEffect(() => {
    try {
      localStorage.setItem("chic_commerce_payment_methods", JSON.stringify(paymentMethods));
    } catch (error) {
      console.error("Failed to save payment methods to localStorage:", error);
    }
  }, [paymentMethods]);

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, "id">) => {
    setPaymentMethods((prev) => [
      ...prev,
      {
        ...method,
        id: Date.now().toString(),
      },
    ]);
  }, []);

  const updatePaymentMethod = useCallback((id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const deletePaymentMethod = useCallback((id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getActivePaymentMethods = useCallback(
    () => paymentMethods.filter((m) => m.isActive),
    [paymentMethods]
  );

  const getPaymentMethod = useCallback(
    (id: string) => paymentMethods.find((m) => m.id === id),
    [paymentMethods]
  );

  return (
    <PaymentMethodsContext.Provider
      value={{
        paymentMethods,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        getActivePaymentMethods,
        getPaymentMethod,
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  );
};
