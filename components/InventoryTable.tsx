import React from 'react';
import { InventoryItem } from '../app/types';
import { Badge } from './Badge';
import { Edit2, Trash2 } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable = ({ items, onEdit, onDelete }: InventoryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left border-separate border-spacing-0">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit Price</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-foreground">{item.name}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
              <td className="px-6 py-4 text-sm font-mono text-primary-foreground">{item.sku}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{item.stockQuantity}</span>
                  {item.stockQuantity < 10 && (
                    <Badge variant="warning">Low Stock</Badge>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">₱{item.unitPrice.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-muted-foreground hover:text-primary-foreground transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive-foreground transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                No items found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
