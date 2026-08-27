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
    // FIXED (BUG-005): clamp the minimum quantity to 1.
    const clamped = Math.max(1, quantity);
    setItems((prev) => {
      const entry = prev[productId];
      if (!entry) return prev;
      return { ...prev, [productId]: { ...entry, quantity: clamped } };
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

  // FIXED (BUG-004): a percentage discount divides by 100, not 1000.
  const discountAmount = (subtotal * discountPercent) / 100;

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
