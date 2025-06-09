import { CellContext } from "@tanstack/react-table";
import { FC } from "react";
import { Badge } from "../../../../../component/Badge";
import { StudentTypes } from "../../types/StudentTypes.types";

export const StatusCell: FC<CellContext<StudentTypes, unknown>> = ({
  row,
}) => {
    const status = row.original.status;
    const badge = status === "Novice" ? "successTable" : status === "Expert" ? "danger" : "warning";
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      <Badge variant={badge}>
        {status}
      </Badge>
    </div>
  );
};