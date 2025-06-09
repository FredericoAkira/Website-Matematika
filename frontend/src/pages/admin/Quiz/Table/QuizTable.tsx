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
import { QuizTypes } from "../types/QuizType.types";


type TopicListProps = {
    columns: ColumnDef<QuizTypes>[];
    data: QuizTypes[];
    errorMessage?: ReactNode;
    loading?: boolean;
    sortings?: { id: string; desc: boolean }[];
    setSortings?: Dispatch<SetStateAction<SortingState>>;
    pagination?: BasePagination["meta"] & {
        state: PaginationState;
        setState: Dispatch<SetStateAction<PaginationState>>;
    };
};

export const QuizTable: FC<TopicListProps> = ({
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