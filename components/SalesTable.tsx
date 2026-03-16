import React from 'react';
import { SaleTransaction } from '../app/types';

interface SalesTableProps {
  sales: SaleTransaction[];
}

export const SalesTable = ({ sales }: SalesTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty Sold</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Value</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {sales.map((sale) => (
          <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-600">{sale.date}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.itemName}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{sale.category}</td>
            <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{sale.quantity}</td>
            <td className="px-6 py-4 text-sm text-emerald-600 font-bold">${sale.totalPrice.toLocaleString()}</td>
          </tr>
        ))}
        {sales.length === 0 && (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
              No sales data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
