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
  salesData = [],
}: DashboardProps) => {
  return (
    <div className="space-y-6">
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
