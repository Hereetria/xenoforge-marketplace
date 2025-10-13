"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string | number;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  duration: string;
  level: string;
}

interface ShoppingCartContextType {
  items: CartItem[];
  addToCart: (course: CartItem) => void;
  removeFromCart: (courseId: string | number) => void;
  clearCart: () => void;
  isInCart: (courseId: string | number) => boolean;
  getTotalPrice: () => number;
  getItemCount: () => number;
  isReady: boolean;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const userId = session?.user?.id ?? "guest";
  const storageKey = `shopping-cart:${userId}`;

  useEffect(() => {
    try {
      const legacyKey = "shopping-cart";
      const legacyCart = localStorage.getItem(legacyKey);
      if (legacyCart && userId !== "guest") {
        localStorage.setItem(storageKey, legacyCart);
        localStorage.removeItem(legacyKey);
      }

      const savedCart = localStorage.getItem(storageKey);
      const parsed: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
      setItems(parsed);
      setIsReady(true);
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setItems([]);
      setIsReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items, storageKey]);

  const addToCart = (course: CartItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === course.id)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const removeFromCart = (courseId: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== courseId));
  };

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = (courseId: string | number) => {
    return items.some((item) => item.id === courseId);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return items.length;
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        getTotalPrice,
        getItemCount,
        isReady,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
}
