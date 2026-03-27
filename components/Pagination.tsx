import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalFilteredItems: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export const Pagination = ({ currentPage, totalPages, itemsPerPage, totalFilteredItems, setCurrentPage }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 bg-popover border-t border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
      <p>
        Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, totalFilteredItems)}</span> of <span className="font-semibold text-foreground">{totalFilteredItems}</span> results
      </p>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => typeof prev === 'number' ? prev - 1 : prev - 1)}
          className="inline-flex items-center justify-center p-2 rounded-2xl border border-border bg-card text-foreground hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => typeof prev === 'number' ? prev + 1 : prev + 1)}
          className="inline-flex items-center justify-center p-2 rounded-2xl border border-border bg-card text-foreground hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
