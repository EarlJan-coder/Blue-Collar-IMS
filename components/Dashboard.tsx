'use client';

import React from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { SalesChart } from './SalesChart';

interface DashboardProps {
  totalItems: number;
  lowStockCount: number;
  totalSalesRevenue: number;
  totalSalesCount: number;
  salesData?: Array<{ date: string; sales: number; revenue: number }>;
}

export const Dashboard = ({
  totalItems,
  lowStockCount,
  totalSalesRevenue,
  totalSalesCount,
  salesData = [],
}: DashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          color="bg-blue-100 dark:bg-blue-950"
        />
        <MetricCard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          color="bg-orange-100 dark:bg-orange-950"
        />
        <MetricCard
          title="Total Sales"
          value={totalSalesCount}
          icon={ShoppingCart}
          color="bg-green-100 dark:bg-green-950"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${totalSalesRevenue.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-purple-100 dark:bg-purple-950"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Sales Chart - Full width */}
        <div className="w-full">
          <SalesChart data={salesData} />
        </div>
      </div>
    </div>
  );
};
