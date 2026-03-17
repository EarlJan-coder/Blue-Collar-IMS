import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, List, LogOut } from 'lucide-react';
import { cn } from '../app/lib/utils';

interface SidebarProps {
  view: 'inventory' | 'sales' | 'categories';
  setView: (view: 'inventory' | 'sales' | 'categories') => void;
}

export const Sidebar = ({ view, setView }: SidebarProps) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Package className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Blue Collar</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button 
          onClick={() => setView('inventory')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            view === 'inventory' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          Inventory
        </button>
        <button 
          onClick={() => setView('sales')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            view === 'sales' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <ShoppingCart className="w-5 h-5" />
          Sales
        </button>
        <button 
          onClick={() => setView('categories')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            view === 'categories' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <List className="w-5 h-5" />
          Categories
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors text-sm">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
