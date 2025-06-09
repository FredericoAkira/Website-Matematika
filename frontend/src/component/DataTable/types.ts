import type { Column, Table } from "@tanstack/react-table";
import type { HTMLAttributes, ReactNode } from "react";

export type DataTableColumnSorterProps<TData, TValue> =
  HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
  };

export type DataTablePaginationProps<TData> = {
  table: Table<TData>;
};

export type DataTableProps<TData> = Table<TData> & {
  className?: string;
  errorMessage?: ReactNode;
  loading?: boolean;
  rowOnClick?: (data: TData) => void;
};
