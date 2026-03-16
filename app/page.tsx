"use client";

import React, { useState, useMemo } from 'react';
import { 
  InventoryItem, 
  SaleTransaction, 
  MOCK_ITEMS, 
  MOCK_SALES, 
  CATEGORIES 
} from './types';

// --- Imported Components ---
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Controls } from '../components/Controls';
import { InventoryTable } from '../components/InventoryTable';
import { SalesTable } from '../components/SalesTable';
import { Pagination } from '../components/Pagination';
import { AddItemModal } from '../components/AddItemModal';

export default function IMSPage() {
  const [view, setView] = useState<'inventory' | 'sales'>('inventory');
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [sales] = useState<SaleTransaction[]>(MOCK_SALES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for new item
  const [newItem, setNewItem] = useState({
    name: '',
    category: CATEGORIES[0],
    stock: '',
    price: ''
  });

  // Derived Metrics
  const totalItems = items.length;
  const lowStockCount = items.filter(i => i.stockQuantity < 10).length;
  const totalSales = sales.reduce((sum, s) => sum + s.totalPrice, 0);

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

  // Actions
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const catCode = newItem.category.slice(0, 4).toUpperCase();
    const nameCode = newItem.name.slice(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const sku = `${catCode}-${nameCode}-${random}`;

    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name,
      category: newItem.category,
      sku,
      stockQuantity: parseInt(newItem.stock) || 0,
      unitPrice: parseFloat(newItem.price) || 0
    };

    setItems([...items, item]);
    setIsModalOpen(false);
    setNewItem({ name: '', category: CATEGORIES[0], stock: '', price: '' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar view={view} setView={setView} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          view={view} 
          totalItems={totalItems} 
          lowStockCount={lowStockCount} 
          totalSales={totalSales} 
          onAddItem={() => setIsModalOpen(true)} 
        />

        <div className="p-8 flex-1 overflow-auto">
          <Controls 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            categoryFilter={categoryFilter} 
            setCategoryFilter={(cat) => {
              setCategoryFilter(cat);
              setCurrentPage(1);
            }} 
          />

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {view === 'inventory' ? (
              <InventoryTable items={paginatedItems} />
            ) : (
              <SalesTable sales={filteredSales} />
            )}

            {view === 'inventory' && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                itemsPerPage={itemsPerPage} 
                totalFilteredItems={filteredItems.length} 
                setCurrentPage={setCurrentPage} 
              />
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
      />
    </div>
  );
}
