import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Category, InventoryItem, NewSale } from '../app/types';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSale: NewSale;
  setNewSale: (sale: NewSale) => void;
  onSubmit: (e: React.FormEvent) => void;
  items: InventoryItem[];
  categories: Category[];
  isEditing?: boolean;
  maxQuantity?: number;
  isLoading?: boolean;
}

export const AddSaleModal = ({ 
  isOpen, 
  onClose, 
  newSale, 
  setNewSale, 
  onSubmit, 
  items,
  categories,
  isEditing = false,
  maxQuantity,
  isLoading = false,
}: AddSaleModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return items.filter(item => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch = !query ||
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, categoryFilter, searchTerm]);

  if (!isOpen) return null;

  const selectedItem = items.find(item => item.id === newSale.itemId);

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);

    if (category !== 'All' && selectedItem?.category !== category) {
      setNewSale({ ...newSale, itemId: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">
            {isEditing ? 'Update Sale' : 'Record New Sale'}
          </h3>
          <button disabled={isLoading} onClick={onClose} className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {!isEditing ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={e => handleCategoryFilterChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-1">Search Item</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name or SKU"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-1">Search Results</label>
                <div className="max-h-60 overflow-y-auto rounded-2xl border border-border bg-popover">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setNewSale({...newSale, itemId: item.id})}
                        disabled={isLoading}
                        className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition ${newSale.itemId === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-xs text-muted-foreground">Stock: {item.stockQuantity}</span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {item.sku} · ₱{item.unitPrice}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">No items match your search.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-popover p-4">
              <p className="text-sm font-semibold text-foreground mb-2">Item</p>
              {selectedItem ? (
                <div>
                  <p className="text-sm font-medium">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {selectedItem.sku}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No item selected.</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Quantity Sold</label>
            <input 
              required
              type="number" 
              min="1"
              max={(maxQuantity ?? selectedItem?.stockQuantity) || undefined}
              value={newSale.quantity}
              onChange={e => setNewSale({...newSale, quantity: e.target.value})}
              placeholder="1"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {selectedItem && (
              <p className="mt-1 text-xs text-muted-foreground">
                {isEditing ? 'Maximum allowed:' : 'Maximum available:'} {maxQuantity ?? selectedItem.stockQuantity}
              </p>
            )}
          </div>

          {selectedItem && newSale.quantity && (
            <div className="p-3 bg-popover rounded-2xl">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total Price:</span>
                <span className="px-6 py-4 text-sm font-mono text-foreground">
                  ₱{(selectedItem.unitPrice * parseInt(newSale.quantity || '0')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3 sm:flex-row">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:flex-1 px-4 py-3 border border-border text-muted-foreground font-semibold rounded-2xl hover:bg-popover/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading || !selectedItem || !newSale.quantity || parseInt(newSale.quantity) > (maxQuantity ?? selectedItem.stockQuantity)}
              className="w-full sm:flex-1 px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Recording...') : (isEditing ? 'Update Sale' : 'Record Sale')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
