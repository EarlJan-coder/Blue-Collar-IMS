import React from 'react';
import { cn } from '../app/lib/utils';

export const Badge = ({ children, variant }: { children: React.ReactNode, variant: 'success' | 'warning' | 'error' | 'neutral' }) => {
  const variants = {
    success: 'bg-chart-2 text-chart-3 border-border',
    warning: 'bg-accent text-accent-foreground border-border',
    error: 'bg-destructive text-destructive-foreground border-border',
    neutral: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border', variants[variant])}>
      {children}
    </span>
  );
};
