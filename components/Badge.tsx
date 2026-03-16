import React from 'react';
import { cn } from '../app/lib/utils';

export const Badge = ({ children, variant }: { children: React.ReactNode, variant: 'success' | 'warning' | 'error' | 'neutral' }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-rose-50 text-rose-700 border-rose-100',
    neutral: 'bg-slate-50 text-slate-700 border-slate-100',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", variants[variant])}>
      {children}
    </span>
  );
};
