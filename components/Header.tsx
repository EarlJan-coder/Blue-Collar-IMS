import React from 'react';
import { Package, ShoppingCart, AlertTriangle, Plus, LogOut } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  view: 'inventory' | 'sales' | 'categories';
  totalItems: number;
  lowStockCount: number;
  totalSales: number;
  onAddItem: () => void;
}

export const Header = ({ view, totalItems, lowStockCount, totalSales, onAddItem }: HeaderProps) => {
  const getTitle = () => {
    switch (view) {
      case 'inventory': return 'Inventory Management';
      case 'sales': return 'Sales Tracking';
      case 'categories': return 'Category Management';
    }
  };

  const getButtonText = () => {
    switch (view) {
      case 'inventory': return 'Add Item';
      case 'sales': return 'New Sale';
      case 'categories': return 'Add Category';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getTitle()}
        </h1>
        <button 
          onClick={onAddItem}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {getButtonText()}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Items" value={totalItems} icon={Package} color="bg-blue-500" />
        <MetricCard title="Low Stock Alerts" value={lowStockCount} icon={AlertTriangle} color="bg-amber-500" />
        <MetricCard title="Total Sales" value={`₱${totalSales.toLocaleString()}`} icon={ShoppingCart} color="bg-emerald-500" />
      </div>
    </header>
  );
};
