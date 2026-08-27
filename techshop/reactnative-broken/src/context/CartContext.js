import React, { createContext, useContext, useState } from 'react';
import { DISCOUNTS } from '../data/products';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // items: { [productId]: { product, quantity } }
  const [items, setItems] = useState({});
  const [discountCode, setDiscountCode] = useState('');

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev[product.id];
      const quantity = existing ? existing.quantity + 1 : 1;
      return { ...prev, [product.id]: { product, quantity } };
    });
  }

  function setQuantity(productId, quantity) {
    // ─────────────────────────────────────────────────────────────
    // BUG-005: quantity is allowed to go below 1 (down to negatives).
    // The requirement is a minimum of 1. There is no clamp here.
    // ─────────────────────────────────────────────────────────────
    setItems((prev) => {
      const entry = prev[productId];
      if (!entry) return prev;
      return { ...prev, [productId]: { ...entry, quantity } };
    });
  }

  function removeItem(productId) {
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  function clearCart() {
    setItems({});
    setDiscountCode('');
  }

  const list = Object.values(items);

  const subtotal = list.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const discountPercent = DISCOUNTS[discountCode] || 0;

  // ───────────────────────────────────────────────────────────────
  // BUG-004: discount divides by 1000 instead of 100.
  // A "10% off" code should subtract subtotal * 10 / 100.
  // Here it subtracts subtotal * 10 / 1000 — one tenth of the real
  // discount — so totals are wrong whenever a code is applied.
  // ───────────────────────────────────────────────────────────────
  const discountAmount = (subtotal * discountPercent) / 1000;

  const total = subtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        items: list,
        addToCart,
        setQuantity,
        removeItem,
        clearCart,
        subtotal,
        discountCode,
        setDiscountCode,
        discountPercent,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
