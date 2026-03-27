import React from 'react';
import { Package, ShoppingCart, AlertTriangle, Plus } from 'lucide-react';
import { MetricCard } from './MetricCard';

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
    <header className="bg-card border-b border-border px-6 py-5 md:px-8 md:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
        <button
          onClick={onAddItem}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          {getButtonText()}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="Total Items" value={totalItems} icon={Package} color="bg-chart-1" />
        <MetricCard title="Low Stock Alerts" value={lowStockCount} icon={AlertTriangle} color="bg-accent" />
        <MetricCard title="Total Sales" value={`₱${totalSales.toLocaleString()}`} icon={ShoppingCart} color="bg-secondary" />
      </div>
    </header>
  );
};
