"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { 
  InventoryItem, 
  SaleTransaction, 
  Category,
  NewItem,
  NewSale
} from './types';

// --- Imported Components ---
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Controls } from '../components/Controls';
import { InventoryTable } from '../components/InventoryTable';
import { SalesTable } from '../components/SalesTable';
import { CategoryTable } from '../components/CategoryTable';
import { Pagination } from '../components/Pagination';
import { AddItemModal } from '../components/AddItemModal';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { AddSaleModal } from '../components/AddSaleModal';

// --- Actions ---
import { getItems, createItem, updateItem, deleteItem } from './actions/items';
import { getCategories, createCategory, updateCategory, deleteCategory } from './actions/categories';
import { getSales, createSale } from './actions/sales';

export default function IMSPage() {
  const [view, setView] = useState<'inventory' | 'sales' | 'categories'>('inventory');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for new/edit item
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    category: '',
    categoryId: '',
    stock: '',
    price: ''
  });

  const [newSale, setNewSale] = useState<NewSale>({
    itemId: '',
    quantity: '1'
  });

  const { data: session, status } = useSession();

  // Fetch initial data for signed-in users
  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchData() {
      const [dbItems, dbCategories, dbSales] = await Promise.all([
        getItems(),
        getCategories(),
        getSales()
      ]);
      
      const mappedItems: InventoryItem[] = dbItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        sku: item.sku,
        stockQuantity: item.stockQuantity,
        unitPrice: parseFloat(item.sellingPrice)
      }));

      const mappedSales: SaleTransaction[] = dbSales.map(sale => ({
        id: sale.id,
        itemId: sale.itemId,
        itemName: sale.item.name,
        category: sale.item.category.name,
        quantity: sale.quantitySold,
        totalPrice: parseFloat(sale.totalPrice),
        date: new Date(sale.createdAt).toLocaleDateString()
      }));

      setItems(mappedItems);
      setCategories(dbCategories);
      setSales(mappedSales);
    }
    fetchData();
  }, [status]);

  // Derived Metrics
  const totalItems = items.length;
  const lowStockCount = items.filter(i => i.stockQuantity < 10).length;
  const totalSalesAmount = sales.reduce((sum, s) => sum + s.totalPrice, 0);

  // Filtered & Paginated Data
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, categoryFilter, searchTerm]);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesCategory = categoryFilter === 'All' || sale.category === categoryFilter;
      const matchesSearch = sale.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [sales, categoryFilter, searchTerm]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
          <span className="text-sm text-slate-600">Loading</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in</h1>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Actions
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingItemId) {
      await updateItem(editingItemId, {
        name: newItem.name,
        categoryId: newItem.categoryId,
        baseCost: newItem.price, // Assuming cost is same as price for now or needs another field
        sellingPrice: newItem.price,
        stockQuantity: parseInt(newItem.stock || '0'),
      });
    } else {
      const catCode = newItem.category.slice(0, 4).toUpperCase();
      const nameCode = newItem.name.slice(0, 3).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      const sku = `${catCode}-${nameCode}-${random}`;

      await createItem({
        name: newItem.name,
        categoryId: newItem.categoryId!,
        baseCost: (parseFloat(newItem.price) * 0.7).toFixed(2), // Mock base cost as 70% of selling price
        sellingPrice: newItem.price,
        stockQuantity: parseInt(newItem.stock || '0'),
        sku,
      });
    }

    // Refresh items
    const dbItems = await getItems();
    const mappedItems: InventoryItem[] = dbItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category.name,
      sku: item.sku,
      stockQuantity: item.stockQuantity,
      unitPrice: parseFloat(item.sellingPrice)
    }));
    setItems(mappedItems);

    setIsModalOpen(false);
    setIsEditing(false);
    setEditingItemId(null);
    setNewItem({ name: '', category: '', categoryId: '', stock: '', price: '' });
  };

  const handleEditClick = (item: InventoryItem) => {
    const category = categories.find(c => c.name === item.category);
    setNewItem({
      name: item.name,
      category: item.category,
      categoryId: category?.id || '',
      stock: item.stockQuantity.toString(),
      price: item.unitPrice.toString()
    });
    setEditingItemId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
      const dbItems = await getItems();
      const mappedItems: InventoryItem[] = dbItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        sku: item.sku,
        stockQuantity: item.stockQuantity,
        unitPrice: parseFloat(item.sellingPrice)
      }));
      setItems(mappedItems);
    }
  };

  // Category Actions
  const handleAddCategorySubmit = async (name: string, id?: string) => {
    if (id) {
      await updateCategory(id, name);
    } else {
      await createCategory(name);
    }
    
    // Refresh categories
    const dbCategories = await getCategories();
    setCategories(dbCategories);
    
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await createSale({
            itemId: newSale.itemId,
            quantitySold: parseInt(newSale.quantity)
        });

        // Refresh items and sales
        const [dbItems, dbSales] = await Promise.all([getItems(), getSales()]);
        
        setItems(dbItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category.name,
            sku: item.sku,
            stockQuantity: item.stockQuantity,
            unitPrice: parseFloat(item.sellingPrice)
        })));

        setSales(dbSales.map(sale => ({
            id: sale.id,
            itemId: sale.itemId,
            itemName: sale.item.name,
            category: sale.item.category.name,
            quantity: sale.quantitySold,
            totalPrice: parseFloat(sale.totalPrice),
            date: new Date(sale.createdAt).toLocaleDateString()
        })));

        setIsSaleModalOpen(false);
        setNewSale({ itemId: '', quantity: '1' });
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to record sale');
    }
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All items in this category will also be deleted.')) {
      await deleteCategory(id);
      
      // Refresh items and categories
      const [dbItems, dbCategories] = await Promise.all([
        getItems(),
        getCategories()
      ]);
      
      const mappedItems: InventoryItem[] = dbItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        sku: item.sku,
        stockQuantity: item.stockQuantity,
        unitPrice: parseFloat(item.sellingPrice)
      }));

      setItems(mappedItems);
      setCategories(dbCategories);
    }
  };

  const handleHeaderAction = () => {
    if (view === 'inventory') {
      setIsEditing(false);
      setNewItem({ name: '', category: '', categoryId: '', stock: '', price: '' });
      setIsModalOpen(true);
    } else if (view === 'categories') {
      setEditingCategory(null);
      setIsCategoryModalOpen(true);
    } else if (view === 'sales') {
      setIsSaleModalOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground font-sans">
      <Sidebar view={view} setView={setView} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          view={view} 
          totalItems={totalItems} 
          lowStockCount={lowStockCount} 
          totalSales={totalSalesAmount} 
          onAddItem={handleHeaderAction} 
        />

        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {view !== 'categories' && (
            <Controls 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              categoryFilter={categoryFilter} 
              setCategoryFilter={(cat) => {
                setCategoryFilter(cat);
                setCurrentPage(1);
              }} 
              categories={categories}
            />
          )}

          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {view === 'inventory' ? (
              <>
                <InventoryTable 
                  items={paginatedItems} 
                  onEdit={handleEditClick}
                  onDelete={handleDeleteItem}
                />
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  itemsPerPage={itemsPerPage} 
                  totalFilteredItems={filteredItems.length} 
                  setCurrentPage={setCurrentPage} 
                />
              </>
            ) : view === 'categories' ? (
              <CategoryTable 
                categories={categories}
                onEdit={handleEditCategoryClick}
                onDelete={handleDeleteCategory}
              />
            ) : (
              <SalesTable sales={filteredSales} />
            )}
          </div>
        </div>
      </main>

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        newItem={newItem} 
        setNewItem={setNewItem} 
        onSubmit={handleAddItem}
        categories={categories}
        isEditing={isEditing}
      />

      <AddCategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleAddCategorySubmit}
        category={editingCategory}
      />

      <AddSaleModal 
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        newSale={newSale}
        setNewSale={setNewSale}
        onSubmit={handleAddSale}
        items={items}
      />
    </div>
  );
}
