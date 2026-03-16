import React from 'react';
import { InventoryItem } from '../app/types';
import { Badge } from './Badge';

interface InventoryTableProps {
  items: InventoryItem[];
}

export const InventoryTable = ({ items }: InventoryTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
            <td className="px-6 py-4 text-sm font-mono text-indigo-600">{item.sku}</td>
            <td className="px-6 py-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.stockQuantity}</span>
                {item.stockQuantity < 10 && (
                  <Badge variant="warning">Low Stock</Badge>
                )}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">${item.unitPrice.toLocaleString()}</td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
              No items found matching your criteria.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
