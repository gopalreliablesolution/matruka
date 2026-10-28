'use client';

import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react';

export interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export interface Filter {
  name: string;
  label: string;
  options?: { label: string; value: string }[];
  value: any;
  onChange: (value: any) => void;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: Filter[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (limit: number) => void;
  };
  onRowClick?: (item: any) => void;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  search,
  filters,
  pagination,
  onRowClick,
  emptyMessage = 'No records found.',
}) => {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(search || (filters && filters.length > 0)) && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full">
            {search && (
              <div className="relative flex-1 min-w-[14rem]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={search.placeholder || 'Search...'}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm"
                />
                {search.value && (
                  <button
                    onClick={() => search.onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            {filters?.map((filter) => (
              <div key={filter.name} className="shrink-0">
                <select
                  value={filter.value || ''}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white"
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3.5 ${
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                        ? 'text-center'
                        : ''
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-primary" size={28} />
                      <p className="text-sm font-medium">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-60">
                      <Search size={36} className="text-gray-300" />
                      <p className="font-medium text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, rowIdx) => (
                  <tr
                    key={item._id || rowIdx}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-colors ${
                      onRowClick ? 'cursor-pointer hover:bg-teal-50/30' : 'hover:bg-gray-50/60'
                    }`}
                  >
                    {columns.map((column, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-4 py-3.5 text-gray-700 text-sm ${
                          column.align === 'right'
                            ? 'text-right'
                            : column.align === 'center'
                            ? 'text-center'
                            : ''
                        }`}
                      >
                        {column.render ? column.render(item) : item[column.accessor] ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>Rows per page:</span>
              <select
                value={pagination.itemsPerPage || 20}
                onChange={(e) => pagination.onItemsPerPageChange?.(Number(e.target.value))}
                className="py-1 px-2 border border-gray-200 rounded bg-gray-50 text-gray-700 font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              {pagination.totalItems !== undefined && (
                <span>
                  Showing{' '}
                  <strong className="text-gray-800">
                    {Math.min(
                      (pagination.currentPage - 1) * (pagination.itemsPerPage || 20) + 1,
                      pagination.totalItems
                    )}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-gray-800">
                    {Math.min(
                      pagination.currentPage * (pagination.itemsPerPage || 20),
                      pagination.totalItems
                    )}
                  </strong>{' '}
                  of <strong className="text-gray-800">{pagination.totalItems}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-1">
                Page <strong className="text-gray-800">{pagination.currentPage}</strong> of{' '}
                <strong className="text-gray-800">{pagination.totalPages || 1}</strong>
              </span>
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm font-medium"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm font-medium"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;

