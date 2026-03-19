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
}

export const AddSaleModal = ({ 
  isOpen, 
  onClose, 
  newSale, 
  setNewSale, 
  onSubmit, 
  items 
}: AddSaleModalProps) => {
  if (!isOpen) return null;

  const selectedItem = items.find(item => item.id === newSale.itemId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Record New Sale</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Item</label>
            <select 
              value={newSale.itemId}
              onChange={e => setNewSale({...newSale, itemId: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity Sold</label>
            <input 
              required
              type="number" 
              min="1"
              max={selectedItem?.stockQuantity || undefined}
              value={newSale.quantity}
              onChange={e => setNewSale({...newSale, quantity: e.target.value})}
              placeholder="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
            />
            {selectedItem && (
                <p className="mt-1 text-xs text-gray-500">
                    Maximum available: {selectedItem.stockQuantity}
                </p>
            )}
          </div>

          {selectedItem && newSale.quantity && (
            <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-bold text-indigo-600">
                        ${(selectedItem.unitPrice * parseInt(newSale.quantity || '0')).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              disabled={!selectedItem || !newSale.quantity || parseInt(newSale.quantity) > selectedItem.stockQuantity}
            >
              Record Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
