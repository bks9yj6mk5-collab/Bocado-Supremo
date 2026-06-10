// src/store/cartStore.ts

import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: (taxPercentage: number) => number;
  getTotal: (taxPercentage: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  getSubtotal: () => {
    const state = get();
    return state.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  },

  getTax: (taxPercentage) => {
    return get().getSubtotal() * (taxPercentage / 100);
  },

  getTotal: (taxPercentage) => {
    const subtotal = get().getSubtotal();
    const tax = get().getTax(taxPercentage);
    return subtotal + tax;
  },
}));
