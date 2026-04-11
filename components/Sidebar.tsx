import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, List, LogOut } from 'lucide-react';
import { cn } from '../app/lib/utils';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  view: 'inventory' | 'sales' | 'categories';
  setView: (view: 'inventory' | 'sales' | 'categories') => void;
}

export const Sidebar = ({ view, setView }: SidebarProps) => {
  return (
    <aside className="hidden md:flex w-64 bg-sidebar text-sidebar-foreground flex-col">
      <div className="px-6 py-5 border-b border-sidebar-border flex items-center gap-3">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-2xl">
          <Package className="w-6 h-6" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Blue Collar</span>
      </div>

      <nav className="flex flex-wrap md:flex-col gap-2 p-4">
        <button
          onClick={() => setView('inventory')}
          className={cn(
            'flex-1 md:flex-none w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition',
            view === 'inventory'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground/80 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent'
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          Inventory
        </button>
        <button
          onClick={() => setView('sales')}
          className={cn(
            'flex-1 md:flex-none w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition',
            view === 'sales'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground/80 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent'
          )}
        >
          <ShoppingCart className="w-5 h-5" />
          Sales
        </button>
        <button
          onClick={() => setView('categories')}
          className={cn(
            'flex-1 md:flex-none w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition',
            view === 'categories'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground/80 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent'
          )}
        >
          <List className="w-5 h-5" />
          Categories
        </button>
      </nav>

      <div className="mt-auto px-4 py-5 border-t border-sidebar-border">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-sidebar-foreground/80 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent transition"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
