import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category } from '../app/types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, id?: string) => void;
  category?: Category | null;
}

export const AddCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category 
}: AddCategoryModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, category?.id);
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">{category ? 'Edit Category' : 'Add New Category'}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Category Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Braking System"
              className="w-full px-4 py-3 border border-border rounded-2xl bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
              {category ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
