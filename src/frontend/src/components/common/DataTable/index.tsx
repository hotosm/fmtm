import React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/RadixComponents/Table';
import { paginationType } from '@/store/types/ICommon';
import DataTablePagination from './DataTablePagination';
import TableSkeleton from '@/components/Skeletons/common/DataTableSkeleton';

export interface ColumnData {
  header: string;
  accessorKey: string;
  cell?: any;
}

type paginationStateType = {
  pageIndex: number;
  pageSize: number;
};

type paginatedDataType = { results: Record<string, any>[]; pagination: paginationType };

interface DataTableProps {
  data: Record<string, any>[] | paginatedDataType;
  columns: ColumnDef<ColumnData>[];
  isLoading?: boolean;
  pagination?: paginationStateType;
  setPaginationPage?: any;
  className?: string;
  tableWrapperClassName?: string;
}

export default function DataTable({
  data,
  columns,
  isLoading = false,
  pagination,
  setPaginationPage,
  className,
  tableWrapperClassName,
}: DataTableProps) {
  const pageCounts =
    ((data as paginatedDataType)?.pagination?.total ?? 0) / (data as paginatedDataType)?.pagination?.per_page;

  const table = useReactTable({
    data: (data as paginatedDataType)?.results ?? data ?? [],
    columns,
    pageCount: Number.isNaN(pageCounts) ? -1 : Number(Math.ceil(pageCounts)),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPaginationPage,
    manualPagination: true,
    debugTable: true,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className={`fmtm-flex fmtm-flex-col fmtm-rounded-lg fmtm-overflow-hidden ${tableWrapperClassName}`}>
      <div className={`fmtm-flex fmtm-flex-col fmtm-flex-1 scrollbar fmtm-overflow-y-auto fmtm-bg-white ${className}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {!header.isPlaceholder && (
                        <div className="fmtm-text-left fmtm-cursor-pointer fmtm-gap-2 fmtm-text-[14px] fmtm-font-bold">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.getValue() !== null ? flexRender(cell.column.columnDef.cell, cell.getContext()) : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="fmtm-text-center">
                  No Data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <DataTablePagination
          table={table}
          isLoading={isLoading}
          currentPage={table.getState().pagination.pageIndex + 1}
          totalCount={(data as paginatedDataType)?.pagination?.total || (data as Record<string, any>[])?.length || 0}
          pageSize={pagination.pageSize}
        />
      )}
    </div>
  );
}
