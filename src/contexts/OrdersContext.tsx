import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order["status"]) => Order[];
  getTotalRevenue: () => number;
  getPendingOrdersCount: () => number;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chic_commerce_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem("chic_commerce_orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders to localStorage:", error);
    }
  }, [orders]);

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    setOrders((prev) => [
      ...prev,
      {
        ...order,
        id: `ORD-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, ...updates, updatedAt: new Date().toISOString() }
          : o
      )
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const getOrdersByStatus = useCallback(
    (status: Order["status"]) => orders.filter((o) => o.status === status),
    [orders]
  );

  const getTotalRevenue = useCallback(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders]
  );

  const getPendingOrdersCount = useCallback(
    () => orders.filter((o) => o.status === "pending").length,
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrder,
        getOrdersByStatus,
        getTotalRevenue,
        getPendingOrdersCount,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
