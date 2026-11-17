'use client';

import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Calendar as CalendarIcon,
  Inbox,
} from 'lucide-react';

export interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export interface Filter {
  name: string;
  label: string;
  type?: 'select' | 'date' | 'date-range' | 'text';
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
  const itemsPerPage = pagination?.itemsPerPage || 20;
  const totalItems = pagination?.totalItems || 0;
  const totalPages = Math.max(pagination?.totalPages || 1, 1);
  const rangeStart = totalItems
    ? Math.min((pagination!.currentPage - 1) * itemsPerPage + 1, totalItems)
    : 0;
  const rangeEnd = totalItems
    ? Math.min(pagination!.currentPage * itemsPerPage, totalItems)
    : 0;

  const renderFilter = (filter: Filter) => {
    const type = filter.type || 'select';

    if (type === 'date') {
      return (
        <div className="relative min-w-[10.5rem]">
          <input
            type="date"
            value={filter.value || ''}
            onChange={(event) => filter.onChange(event.target.value)}
            className="w-full rounded-lg border border-[#D8E1E4] bg-white py-2.5 pl-10 pr-9 text-sm text-[#344B53] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <CalendarIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA3AD]"
          />
          {filter.value && (
            <button
              type="button"
              onClick={() => filter.onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#8AA3AD] hover:bg-gray-100 hover:text-[#344B53]"
              aria-label={`Clear ${filter.label}`}
            >
              <X size={13} />
            </button>
          )}
        </div>
      );
    }

    if (type === 'date-range') {
      const value = filter.value || { from: '', to: '' };
      return (
        <div className="flex min-w-[17rem] items-center gap-2 rounded-lg border border-[#D8E1E4] bg-white px-3 py-1.5">
          <input
            type="date"
            value={value.from || ''}
            onChange={(event) =>
              filter.onChange({ ...value, from: event.target.value })
            }
            className="min-w-0 flex-1 bg-transparent py-1 text-xs text-[#344B53] outline-none"
            aria-label={`${filter.label} from`}
          />
          <span className="text-xs text-[#8AA3AD]">to</span>
          <input
            type="date"
            value={value.to || ''}
            onChange={(event) =>
              filter.onChange({ ...value, to: event.target.value })
            }
            className="min-w-0 flex-1 bg-transparent py-1 text-xs text-[#344B53] outline-none"
            aria-label={`${filter.label} to`}
          />
        </div>
      );
    }

    if (type === 'text') {
      return (
        <input
          type="text"
          value={filter.value || ''}
          onChange={(event) => filter.onChange(event.target.value)}
          placeholder={filter.label}
          className="min-w-[12rem] rounded-lg border border-[#D8E1E4] bg-white px-3.5 py-2.5 text-sm text-[#344B53] outline-none transition placeholder:text-[#8AA3AD] focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      );
    }

    return (
      <select
        value={filter.value || ''}
        onChange={(event) => filter.onChange(event.target.value)}
        className="min-w-[10.5rem] rounded-lg border border-[#D8E1E4] bg-white px-3.5 py-2.5 text-sm font-medium text-[#344B53] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        aria-label={filter.label}
      >
        <option value="">{filter.label}</option>
        {filter.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="space-y-4">
      {(search || (filters && filters.length > 0)) && (
        <div className="rounded-xl border border-[#E1E9EB] bg-white p-3.5 shadow-sm sm:p-4">
          <div className="flex w-full flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {search && (
                <div className="relative min-w-0 flex-1 sm:min-w-[15rem]">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8AA3AD]"
                    size={17}
                  />
                  <input
                    type="search"
                    placeholder={search.placeholder || 'Search records...'}
                    value={search.value}
                    onChange={(event) => search.onChange(event.target.value)}
                    className="w-full rounded-lg border border-[#D8E1E4] bg-[#F8FAFB] py-2.5 pl-10 pr-9 text-sm text-[#27393F] outline-none transition placeholder:text-[#8AA3AD] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                  />
                  {search.value && (
                    <button
                      type="button"
                      onClick={() => search.onChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8AA3AD] transition hover:bg-gray-100 hover:text-[#344B53]"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              {filters?.map((filter) => (
                <div key={filter.name} className="shrink-0">
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col overflow-hidden rounded-xl border border-[#E1E9EB] bg-white shadow-sm">
        <div className="overflow-x-auto rounded-t-xl">
          <div className="admin-sidebar-scroll max-h-[calc(100vh-17rem)] min-h-[14rem] overflow-y-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead className="sticky top-0 z-10 border-b border-[#D8E1E4] bg-[#F6F8F9]">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={`${column.accessor}-${index}`}
                      scope="col"
                      className={`whitespace-nowrap bg-[#F6F8F9] px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4D636B] ${
                        column.align === 'right'
                          ? 'text-right'
                          : column.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${column.className || ''}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-[#637C85]">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light/20">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#344B53]">
                            Loading records
                          </p>
                          <p className="mt-0.5 text-xs text-[#8AA3AD]">
                            Please wait while we prepare the latest data.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="p-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F4F5] text-[#8AA3AD]">
                          <Inbox size={23} />
                        </span>
                        <p className="text-sm font-semibold text-[#344B53]">
                          {emptyMessage}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#8AA3AD]">
                          Try adjusting your filters or add a new record to get
                          started.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item, rowIndex) => (
                    <tr
                      key={item._id || item.id || rowIndex}
                      onClick={() => onRowClick?.(item)}
                      className={`border-b border-[#EDF1F2] transition-colors last:border-0 ${
                        onRowClick
                          ? 'cursor-pointer hover:bg-primary-light/[0.15]'
                          : 'hover:bg-[#F8FAFB]'
                      }`}
                    >
                      {columns.map((column, columnIndex) => (
                        <td
                          key={`${column.accessor}-${columnIndex}`}
                          className={`px-4 py-3.5 text-sm leading-relaxed text-[#4D636B] ${
                            column.align === 'right'
                              ? 'text-right'
                              : column.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          } ${column.className || ''}`}
                        >
                          {column.render
                            ? column.render(item)
                            : item[column.accessor] ?? 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#D8E1E4] bg-white px-4 py-3 sm:flex-row">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#637C85]">
              {pagination.onItemsPerPageChange && (
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <select
                    value={itemsPerPage}
                    onChange={(event) =>
                      pagination.onItemsPerPageChange?.(Number(event.target.value))
                    }
                    className="rounded-md border border-[#D8E1E4] bg-white px-2 py-1.5 text-[11px] font-semibold text-[#344B53] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    aria-label="Rows per page"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              )}

              {pagination.totalItems !== undefined && (
                <span>
                  Showing{' '}
                  <strong className="font-semibold text-[#344B53]">
                    {rangeStart}
                  </strong>{' '}
                  to{' '}
                  <strong className="font-semibold text-[#344B53]">
                    {rangeEnd}
                  </strong>{' '}
                  of{' '}
                  <strong className="font-semibold text-[#344B53]">
                    {totalItems}
                  </strong>{' '}
                  records
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-1 text-[11px] text-[#637C85]">
                Page{' '}
                <strong className="font-semibold text-[#344B53]">
                  {pagination.currentPage}
                </strong>{' '}
                of{' '}
                <strong className="font-semibold text-[#344B53]">
                  {totalPages}
                </strong>
              </span>
              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8E1E4] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#637C85] shadow-sm transition hover:bg-[#F6F8F9] hover:text-[#344B53] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={13} />
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.currentPage >= totalPages}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8E1E4] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#637C85] shadow-sm transition hover:bg-[#F6F8F9] hover:text-[#344B53] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
