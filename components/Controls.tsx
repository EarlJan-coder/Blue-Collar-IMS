import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Category } from '../app/types';

interface ControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: Category[];
}

export const Controls = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, categories }: ControlsProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-2xl bg-popover text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
      <div className="relative min-w-[220px] w-full sm:w-auto">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full pl-10 pr-8 py-3 border border-border rounded-2xl bg-popover text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
        </select>
      </div>
    </div>
  );
};
