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
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalFilteredItems)}</span> of <span className="font-medium">{totalFilteredItems}</span> results
      </p>
      <div className="flex gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => typeof prev === 'number' ? prev - 1 : prev - 1)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => typeof prev === 'number' ? prev + 1 : prev + 1)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
