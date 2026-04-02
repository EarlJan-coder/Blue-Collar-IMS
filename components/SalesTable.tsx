import React from 'react';
import { SaleTransaction } from '../app/types';
import { Edit2, Trash2 } from 'lucide-react';

interface SalesTableProps {
  sales: SaleTransaction[];
  onDelete?: (saleId: string) => void;
  onUpdate?: (sale: SaleTransaction) => void;
}

export const SalesTable = ({ sales, onDelete, onUpdate }: SalesTableProps) => {
  const showActions = Boolean(onDelete || onUpdate);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-left border-separate border-spacing-0">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty Sold</th>
            <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Value</th>
            {showActions && (
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 text-sm text-foreground">{sale.date}</td>
              <td className="px-6 py-4 text-sm font-medium text-foreground">{sale.itemName}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{sale.category}</td>
              <td className="px-6 py-4 text-sm font-semibold text-foreground">{sale.quantity}</td>
              <td className="px-6 py-4 text-sm font-bold text-primary-foreground">₱{sale.totalPrice.toLocaleString()}</td>
              {showActions && (
                <td className="px-6 py-4 text-sm space-x-2">
                  {onUpdate && (
                    <button
                      type="button"
                      onClick={() => onUpdate(sale)}
                      className="p-2 text-muted-foreground hover:text-primary-foreground transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(sale.id)}
                     className="p-2 text-muted-foreground hover:text-destructive-foreground transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                No sales data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
