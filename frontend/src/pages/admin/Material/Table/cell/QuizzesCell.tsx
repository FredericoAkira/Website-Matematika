import { CellContext } from "@tanstack/react-table";
import { ChevronRight, XIcon } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../../../../../component/Dialog";
import { MaterialTypes } from "../../types/MaterialType.types";

export const QuizzesCell: FC<CellContext<MaterialTypes, unknown>> = ({
    row,
}) => {
  const quizzes = row.original.quizzes;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const JRItem = (item: string) => {
    return (
      <div
        className="flex border rounded-md px-4 py-2 justify-between cursor-pointer mb-4 items-center"
        onClick={() =>
          navigate(
            `/admin/quiz/${item}`
            // { replace: true },
          )
        }
      >
        <div>
          {item}
        </div>
        <ChevronRight className="text-primary-600" />
      </div>
    );
  };

  return (
      <div className="flex-col items-center justify-start text-wrap min-w-44">
      <>
        <p>{quizzes.length ?? 0} quizzes</p>
        {quizzes && quizzes?.length > 0 && (
          <p
            className={`italic text-xs underline decoration-solid text-blue-600 cursor-pointer`}
            onClick={() => setShowModal(true)}
          >
            See Quiz List
          </p>
        )}
      </>
      <Dialog
        open={showModal}
        onOpenChange={setShowModal}
      >
        <Dialog.Content className="flex justify-center w-[40vw] max-w-[90vw]">
          <Dialog.Header className="flex-row">
            <Dialog.Title className="ml-auto">Quiz List</Dialog.Title>
            <div className="ml-auto">
              <button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <XIcon
                  size={20}
                  className="cursor-pointer"
                />
              </button>
            </div>
          </Dialog.Header>
          <div className="flex-col max-h-[50vh] overflow-auto">
            {quizzes &&
              quizzes.length > 0 &&
              quizzes.map((item) => {
                return JRItem(item);
              })}
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}