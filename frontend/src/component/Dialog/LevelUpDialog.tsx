import { XCircleIcon } from "lucide-react";
import { type FC } from "react";
import { Dialog } from ".";
import { LevelResponse } from "../../api/usePostLevelUp";
import { Button } from "../Button/button";


type FalseDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: (state: string) => void;
  data?: LevelResponse;
};

export const LevelUpDialog: FC<FalseDialogProps> = ({
  open,
  setOpen,
  data,
  onClose,
}) => {
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose("apply");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 w-[40dvw] max-w-[40dvw]">
        <Dialog.Header className="-mr-3">
        <div className="flex justify-end items-center">
            <button
              onClick={() => {
                setOpen?.(false);
              }}
              className="mr-2"
            >
              <XCircleIcon className="text-red-500" />
            </button>
          </div>
        </Dialog.Header>

        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col w-full items-center justify-center text-[17px] gap-x-1 bg-blue-100 p-2 rounded-lg">
            <span className="whitespace-nowrap">{data?.data.newLevel === "Rookie" ? "Selamat Datang petualang baru! Level kamu" : "Selamat! Kamu berhasil naik ke level"}</span>
            <span className="text-lg font-bold mx-1 my-5 whitespace-nowrap">
              {data?.data.newLevel === "Rookie" ? "🎉" :
                data?.data.newLevel === "Challenger" ? "⚔️" :
                data?.data.newLevel === "Explorer" ? "🧭" : "👑"}
              {data?.data.newLevel}
            </span>
            <span className="text-sm text-center">{"Hebat! Sekarang kamu sudah siap untuk mengerjakan soal - soal yang lebih sulit!"}</span>
          </div>
        </div>

        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-end items-center">
            <Button
              onClick={() => handleClose()}
              //disabled={!form.watch("interviewCategoryDownload")}
            >
              {"Tutup"}
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
