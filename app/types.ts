export interface Category {
  id: string;
  name: string;
}

export interface DbItem {
  id: string;
  name: string;
  categoryId: string;
  baseCost: string;
  sellingPrice: string;
  stockQuantity: number;
  sku: string;
  createdAt: Date;
}

export interface DbSale {
  id: string;
  itemId: string;
  quantitySold: number;
  totalPrice: string;
  totalProfit: string | null;
  createdAt: Date;
}

export interface DbSaleWithItem extends DbSale {
  item: DbItemWithCategory;
}

export interface NewSale {
  itemId: string;
  quantity: string;
}

export interface DbItemWithCategory extends DbItem {
  category: Category;
}

export interface NewItem {
  name: string;
  category: string;
  categoryId?: string;
  stock: string;
  price: string;
}

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



export const MOCK_SALES: SaleTransaction[] = [
  { id: 's1', itemId: '1', itemName: 'MacBook Pro', category: 'Electronics', quantity: 1, totalPrice: 1999, date: '2026-03-10' },
  { id: 's2', itemId: '3', itemName: 'Coffee Beans', category: 'Food', quantity: 5, totalPrice: 75, date: '2026-03-12' },
  { id: 's3', itemId: '2', itemName: 'Ergonomic Chair', category: 'Furniture', quantity: 2, totalPrice: 500, date: '2026-03-14' },
];

