import React from 'react';
import { Category } from '../app/types';
import { Edit2, Trash2 } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryTable = ({ categories, onEdit, onDelete }: CategoryTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {categories.map((category) => (
          <tr key={category.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(category)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(category.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {categories.length === 0 && (
          <tr>
            <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
              No categories found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
