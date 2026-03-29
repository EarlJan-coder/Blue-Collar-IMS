import React from 'react';
import { X } from 'lucide-react';
import { Category, NewItem } from '../app/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  newItem: NewItem;
  setNewItem: (item: NewItem) => void;
  onSubmit: (e: React.FormEvent) => void;
  categories: Category[];
  isEditing?: boolean;
}

export const AddItemModal = ({ 
  isOpen, 
  onClose, 
  newItem, 
  setNewItem, 
  onSubmit, 
  categories,
  isEditing = false
}: AddItemModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">{isEditing ? 'Edit Item' : 'Add New Inventory Item'}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Item Name</label>
            <input 
              required
              type="text" 
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              placeholder="e.g. Wireless Mouse"
              className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Category</label>
            <select 
              value={newItem.categoryId || ''}
              onChange={e => {
                const selectedCat = categories.find(c => c.id === e.target.value);
                setNewItem({
                  ...newItem, 
                  categoryId: e.target.value,
                  category: selectedCat ? selectedCat.name : ''
                });
              }}
              required
              className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1">Stock</label>
              <input 
                required
                type="number" 
                min="0"
                value={newItem.stock}
                onChange={e => setNewItem({...newItem, stock: e.target.value})}
                placeholder="0"
                className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1">Price</label>
              <input 
                required
                type="number" 
                step="0.01" 
                min="0"
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: e.target.value})}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3 sm:flex-row">
            <button 
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-3 border border-border text-muted-foreground font-semibold rounded-2xl hover:bg-popover/80 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-full sm:flex-1 px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              {isEditing ? 'Update Item' : 'Create SKU & Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
