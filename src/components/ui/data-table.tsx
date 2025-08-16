
'use client';

import * as React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTablePagination } from './data-table-pagination';

export interface ColumnDef<TData> {
  accessorKey: keyof TData | 'actions';
  header: string;
  cell: (props: { row: { original: TData } }) => React.ReactNode;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  currentLimit: number;
  onLimitChange: (limit: number) => void;
  hidePagination?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  error,
  children,
  pageCount,
  currentPage,
  onPageChange,
  currentLimit,
  onLimitChange,
  hidePagination,
}: DataTableProps<TData>) {

  return (
    <div className="space-y-4">
      {children}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(currentLimit)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column, j) => (
                    <TableCell key={`${i}-${j}`}>
                      <Skeleton className="h-6" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-destructive h-24">
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell({ row: { original: row } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hidePagination && 
      <DataTablePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChange}
        currentLimit={currentLimit}
        onLimitChange={onLimitChange}
      />}
    </div>
  );
}
