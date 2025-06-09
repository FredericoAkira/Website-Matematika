import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { type FC } from "react";
import { Dialog } from ".";
import { MaterialContent } from "../../pages/user/Material/MaterialContent";
import { Button } from "../Button/button";


type CorrectDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: (state: string) => void;
  material: {
      explanation: string,
      audio: string,
      image: string,
      text: string,
      video: string
  }
  isLast: boolean;
};

export const CorrectDialog: FC<CorrectDialogProps> = ({
  open,
  setOpen,
  material,
  onClose,
  isLast
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
      <Dialog.Content className="gap-4 items-center justify-center w-[80vw] xl:w-[30vw] xl:max-w-[30vw]">
        <Dialog.Header className="-mr-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
                <div className="p-2 rounded-2xl bg-green-300">
                    <CheckCircleIcon className="bg-green-300 text-green-600"/>
                </div>
                <p className="text-green-600 font-semibold text-lg -mt-0.5">Jawaban Kamu Benar!</p>
            </div>
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

        <MaterialContent material={[material]} compact/>

        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-end items-center">
            <Button
              onClick={() => {
                if(isLast) {
                  setOpen(false)
                } else {
                  handleClose()
                }}}
              //disabled={!form.watch("interviewCategoryDownload")}
            >
              {isLast ? "Tutup" : "Soal Berikutnya"}
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
