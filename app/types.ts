export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stockQuantity: number;
  unitPrice: number;
}

export interface SaleTransaction {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  quantity: number;
  totalPrice: number;
  date: string;
}

export const MOCK_ITEMS: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro', category: 'Electronics', sku: 'ELEC-MAC-8291', stockQuantity: 15, unitPrice: 1999 },
  { id: '2', name: 'Ergonomic Chair', category: 'Furniture', sku: 'FURN-CHR-4421', stockQuantity: 8, unitPrice: 250 },
  { id: '3', name: 'Coffee Beans', category: 'Food', sku: 'FOOD-COF-1102', stockQuantity: 50, unitPrice: 15 },
  { id: '4', name: 'iPhone 15', category: 'Electronics', sku: 'ELEC-IPH-9382', stockQuantity: 20, unitPrice: 999 },
  { id: '5', name: 'Desk Lamp', category: 'Furniture', sku: 'FURN-LAM-5532', stockQuantity: 5, unitPrice: 45 },
  { id: '6', name: 'USB-C Cable', category: 'Electronics', sku: 'ELEC-USB-1234', stockQuantity: 100, unitPrice: 19 },
  { id: '7', name: 'Office Desk', category: 'Furniture', sku: 'FURN-DSK-9900', stockQuantity: 12, unitPrice: 450 },
  { id: '8', name: 'Monitor Arm', category: 'Office Supplies', sku: 'OFFI-ARM-8821', stockQuantity: 15, unitPrice: 89 },
  { id: '9', name: 'Wireless Mouse', category: 'Electronics', sku: 'ELEC-MOU-7712', stockQuantity: 30, unitPrice: 49 },
  { id: '10', name: 'Mechanical Keyboard', category: 'Electronics', sku: 'ELEC-KEY-6654', stockQuantity: 25, unitPrice: 129 },
  { id: '11', name: 'Chef Knife', category: 'Kitchen', sku: 'KITC-KNI-1122', stockQuantity: 7, unitPrice: 75 },
  { id: '12', name: 'Frying Pan', category: 'Kitchen', sku: 'KITC-PAN-3344', stockQuantity: 10, unitPrice: 40 },
];

export const MOCK_SALES: SaleTransaction[] = [
  { id: 's1', itemId: '1', itemName: 'MacBook Pro', category: 'Electronics', quantity: 1, totalPrice: 1999, date: '2026-03-10' },
  { id: 's2', itemId: '3', itemName: 'Coffee Beans', category: 'Food', quantity: 5, totalPrice: 75, date: '2026-03-12' },
  { id: 's3', itemId: '2', itemName: 'Ergonomic Chair', category: 'Furniture', quantity: 2, totalPrice: 500, date: '2026-03-14' },
];

export const CATEGORIES = ['Electronics', 'Furniture', 'Food', 'Office Supplies', 'Kitchen'];
