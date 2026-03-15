"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Artwork, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; artwork: Artwork }
  | { type: "REMOVE_ITEM"; artworkId: string }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

interface CartContextValue extends CartState {
  addItem: (artwork: Artwork) => void;
  removeItem: (artworkId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (artworkId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(
        (item) => item.artwork._id === action.artwork._id
      );
      if (exists) return state;
      return {
        ...state,
        items: [...state.items, { artwork: action.artwork, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.artwork._id !== action.artworkId
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [state.items]);

  const totalItems = state.items.length;
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.artwork.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    ...state,
    addItem: (artwork) => dispatch({ type: "ADD_ITEM", artwork }),
    removeItem: (artworkId) => dispatch({ type: "REMOVE_ITEM", artworkId }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    totalItems,
    totalPrice,
    isInCart: (artworkId) =>
      state.items.some((item) => item.artwork._id === artworkId),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
