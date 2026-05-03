import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(course) {
    setItems((prev) => {
      const id = course._path || course.slug || course.title;
      if (prev.some((item) => (item._path || item.slug || item.title) === id)) return prev;
      return [...prev, course];
    });
  }

  return (
    <CartContext.Provider value={{ items, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
