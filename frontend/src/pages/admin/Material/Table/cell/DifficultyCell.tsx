import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { Badge } from "../../../../../component/Badge";
import { MaterialTypes } from "../../types/MaterialType.types";

export const DifficultyCell: FC<CellContext<MaterialTypes, unknown>> = ({
  row,
}) => {
  const difficulty = row.original.difficulty;
  const badge = difficulty.toLowerCase() === "novice" ? "success" : difficulty.toLowerCase() === "expert" ? "danger" : "warning";
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      <Badge variant={badge}>
        {difficulty || "-"}
      </Badge>
    </div>
  );
};
