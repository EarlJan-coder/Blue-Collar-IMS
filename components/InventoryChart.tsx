'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface InventoryChartProps {
  data: Array<{ category: string; count: number }>;
}

export const InventoryChart = ({ data }: InventoryChartProps) => {
  const chartData = useMemo(() => {
    if (data.length === 0) {
      // Generate sample data for demonstration
      return [
        { category: 'Electronics', count: 45 },
        { category: 'Tools', count: 32 },
        { category: 'Hardware', count: 28 },
        { category: 'Safety', count: 19 },
        { category: 'Other', count: 15 },
      ];
    }
    return data;
  }, [data]);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground mb-6">Inventory by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          layout="vertical"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            dataKey="category"
            type="category"
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--foreground)',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
            cursor={{ fill: 'var(--accent)' }}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[0, 8, 8, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
