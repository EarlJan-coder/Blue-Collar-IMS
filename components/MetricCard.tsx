import React from 'react';
import { cn } from '../app/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export const MetricCard = ({ title, value, icon: Icon, color }: MetricCardProps) => (
  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
    <div className={cn('p-3 rounded-2xl', color)}>
      <Icon className="w-6 h-6 text-primary-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);
