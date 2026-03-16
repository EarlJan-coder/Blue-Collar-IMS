import React from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../app/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  newItem: {
    name: string;
    category: string;
    stock: string;
    price: string;
  };
  setNewItem: (item: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddItemModal = ({ isOpen, onClose, newItem, setNewItem, onSubmit }: AddItemModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Add New Inventory Item</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
            <input 
              required
              type="text" 
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              placeholder="e.g. Wireless Mouse"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select 
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
              <input 
                required
                type="number" 
                min="0"
                value={newItem.stock}
                onChange={e => setNewItem({...newItem, stock: e.target.value})}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Unit Price ($)</label>
              <input 
                required
                type="number" 
                step="0.01" 
                min="0"
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: e.target.value})}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

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
            >
              Create SKU & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
