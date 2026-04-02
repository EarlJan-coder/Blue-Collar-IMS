import React from 'react';
import { X } from 'lucide-react';
import { InventoryItem, NewSale } from '../app/types';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSale: NewSale;
  setNewSale: (sale: NewSale) => void;
  onSubmit: (e: React.FormEvent) => void;
  items: InventoryItem[];
  isEditing?: boolean;
  maxQuantity?: number;
}

export const AddSaleModal = ({ 
  isOpen, 
  onClose, 
  newSale, 
  setNewSale, 
  onSubmit, 
  items,
  isEditing = false,
  maxQuantity,
}: AddSaleModalProps) => {
  if (!isOpen) return null;

  const selectedItem = items.find(item => item.id === newSale.itemId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">
            {isEditing ? 'Update Sale' : 'Record New Sale'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Select Item</label>
            <select 
              value={newSale.itemId}
              onChange={e => setNewSale({...newSale, itemId: e.target.value})}
              required
              disabled={isEditing}
              className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
            >
              <option value="" disabled>Select an item</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Stock: {item.stockQuantity}) - ${item.unitPrice}
                </option>
              ))}
            </select>
          </div>

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
              className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                <span className="font-bold text-primary-foreground">
                  ₱{(selectedItem.unitPrice * parseInt(newSale.quantity || '0')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

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
              disabled={!selectedItem || !newSale.quantity || parseInt(newSale.quantity) > (maxQuantity ?? selectedItem.stockQuantity)}
            >
              {isEditing ? 'Update Sale' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
