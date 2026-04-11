import React from 'react';
import { LayoutDashboard, ShoppingCart, List } from 'lucide-react';
import { cn } from '../app/lib/utils';

interface MobileBottomNavProps {
  view: 'inventory' | 'sales' | 'categories';
  setView: (view: 'inventory' | 'sales' | 'categories') => void;
}

export const MobileBottomNav = ({ view, setView }: MobileBottomNavProps) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
      <div className="flex">
        <button
          onClick={() => setView('inventory')}
          className={cn(
            'flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors',
            view === 'inventory'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          Inventory
        </button>
        <button
          onClick={() => setView('sales')}
          className={cn(
            'flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors',
            view === 'sales'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ShoppingCart className="w-5 h-5 mb-1" />
          Sales
        </button>
        <button
          onClick={() => setView('categories')}
          className={cn(
            'flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors',
            view === 'categories'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <List className="w-5 h-5 mb-1" />
          Categories
        </button>
      </div>
    </nav>
  );
};