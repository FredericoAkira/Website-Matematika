import {
    type ColumnDef,
    type PaginationState,
    SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    type Dispatch,
    type FC,
    type ReactNode,
    type SetStateAction,
} from "react";

import { DataTable } from "../../../../component/DataTable";
import { TopicTypes } from "../types/TopicType.types";


type TopicListProps = {
    columns: ColumnDef<TopicTypes>[];
    data: TopicTypes[];
    errorMessage?: ReactNode;
    loading?: boolean;
    sortings?: { id: string; desc: boolean }[];
    setSortings?: Dispatch<SetStateAction<SortingState>>;
    pagination?: BasePagination["meta"] & {
        state: PaginationState;
        setState: Dispatch<SetStateAction<PaginationState>>;
    };
};

export const TopicTable: FC<TopicListProps> = ({
    columns,
    data,
    errorMessage,
    loading,
    pagination,
    setSortings,
    sortings,
}) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        ...(pagination && {
            manualPagination: true,
            pageCount: pagination.totalPage,
            state: { pagination: pagination.state, sorting: sortings },
            onPaginationChange: pagination.setState,
            onSortingChange: setSortings,
        }),
    });

    return (
        <DataTable
            {...table}
            errorMessage={errorMessage}
            loading={loading}
        />
    );
};