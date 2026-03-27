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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left border-separate border-spacing-0">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-foreground">{category.name}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="p-2 text-muted-foreground hover:text-primary-foreground transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-2 text-muted-foreground hover:text-destructive-foreground transition-colors"
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
              <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
