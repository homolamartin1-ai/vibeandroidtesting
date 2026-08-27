// TechShop catalog data. Shared by the catalog and cart.
// Prices are in whole dollars for simple, testable math.

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    icon: '🎧',
    price: 60,
    inStock: true,
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    icon: '⌨️',
    price: 90,
    inStock: true,
  },
  {
    id: 'p3',
    // Deliberately long name — the catalog cell must handle it (see BUG-007).
    name: 'Ultra-Wide Curved 49-inch Professional Gaming Monitor with HDR',
    icon: '🖥️',
    price: 700,
    inStock: true,
  },
  {
    id: 'p4',
    name: 'USB-C Hub',
    icon: '🔌',
    price: 40,
    inStock: false,
  },
];

// Valid discount codes: percentage off the subtotal.
export const DISCOUNTS = {
  SAVE10: 10,
  SAVE20: 20,
};
