import React from 'react';
import { SaleTransaction } from '../app/types';

interface SalesTableProps {
  sales: SaleTransaction[];
}

export const SalesTable = ({ sales }: SalesTableProps) => {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 text-sm text-foreground">{sale.date}</td>
              <td className="px-6 py-4 text-sm font-medium text-foreground">{sale.itemName}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{sale.category}</td>
              <td className="px-6 py-4 text-sm font-semibold text-foreground">{sale.quantity}</td>
              <td className="px-6 py-4 text-sm font-bold text-primary-foreground">${sale.totalPrice.toLocaleString()}</td>
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
