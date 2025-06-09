
import { flexRender } from "@tanstack/react-table";
import {
  ArrowDownAzIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpAzIcon,
  ArrowUpDownIcon,
  InboxIcon,
  LoaderIcon,
} from "lucide-react";
import { Pagination } from "react-headless-pagination";
import { Table } from "../Table";
import { cn } from "../utils";
import type {
  DataTableColumnSorterProps,
  DataTablePaginationProps,
  DataTableProps,
} from "./types";

/**
 * @description
 * Add sorting on column headers.
 */
const DataTableColumnSorter = <TData, TValue>({
  className,
  column,
  title,
}: DataTableColumnSorterProps<TData, TValue>) => {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>;

  return (
    <button
      className={cn("inline-flex items-center", className)}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowUpAzIcon className="w-4 h-4 ml-2" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDownAzIcon className="w-4 h-4 ml-2" />
      ) : (
        <ArrowUpDownIcon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};

/**
 * @description
 * Pagination controls for your table.
 */
export const DataTablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  const buttonClassNames = cn(
    "flex items-center gap-2 py-2 px-3 bg-white text-[#344054] text-xs border border-[#D0D5DD] rounded-lg shadow-xs disabled:bg-neutral-bg disabled:opacity-50",
  );

  return (
    <Pagination
      className="flex items-center justify-between gap-4 p-4"
      currentPage={table.getState().pagination.pageIndex}
      edgePageCount={1}
      middlePagesSiblingCount={1}
      setCurrentPage={table.setPageIndex}
      totalPages={table.getPageCount()}
      truncableText="..."
      truncableClassName={buttonClassNames}
    >
      <Pagination.PrevButton
        className={buttonClassNames}
        disabled={!table.getCanPreviousPage()}
        onClick={table.previousPage}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Previous
      </Pagination.PrevButton>
      <nav className="flex justify-center flex-grow">
        <ul className="flex items-center gap-0.5">
          <Pagination.PageButton
            activeClassName="bg-epicc-e-50 text-primary-500"
            inactiveClassName="bg-white text-[#667085] hover:text-primary-500"
            className={cn(
              "w-10 h-10 rounded-lg inline-flex items-center justify-center text-xs",
              "border border-transparent focus:outline-none cursor-pointer",
              "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
              "transition ease-out duration-200",
            )}
          />
        </ul>
      </nav>
      <Pagination.NextButton
        className={buttonClassNames}
        disabled={!table.getCanNextPage()}
        onClick={table.nextPage}
      >
        Next
        <ArrowRightIcon className="w-4 h-4" />
      </Pagination.NextButton>
    </Pagination>
  );
};

export const DataTable = <TData,>({
  className,
  errorMessage,
  loading,
  rowOnClick,
  ...table
}: DataTableProps<TData>) => {
  return (
    <div className="relative flex flex-col transition duration-200 ease-out bg-white rounded-lg shadow-md">
      {loading && (
        <div
          className={cn(
            "absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition",
            loading ? "opacity-50" : "opacity-0",
          )}
        >
          <LoaderIcon className="animate-spin text-primary-500" />
        </div>
      )}
      <Table
        className={cn(loading && "opacity-50 pointer-events-none", className)}
      >
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Head
                    key={header.id}
                    style={{ width: header.getSize() }}
                    // className="border-r border-gray-200 last:border-r-0"
                  >
                    <div className="px-6 line-clamp-1 text-center flex justify-center items-center w-full">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {errorMessage ? (
            <Table.Row>
              <Table.Cell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                {errorMessage}
              </Table.Cell>
            </Table.Row>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={rowOnClick ? "cursor-pointer" : ""}
                onClick={
                  rowOnClick ? () => rowOnClick(row.original) : undefined // Hanya tambahkan jika prop `rowOnClick` ada
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="border-r border-gray-200 last:border-r-0 bg-blue-200/30"
                  >
                    <div className="px-6 line-clamp-1 text-center flex justify-center items-center w-full">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell
                colSpan={table.getAllColumns().length}
                className="relative h-24 text-center"
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-xs text-neutral-tertiary py-4 transition",
                    loading ? "opacity-0" : "opacity-100",
                  )}
                >
                  <InboxIcon />
                  <p>No data can be shown.</p>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {table.options.manualPagination !== undefined && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
};

DataTable.ColumnSorter = DataTableColumnSorter;
DataTable.Pagination = DataTablePagination;
