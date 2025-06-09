// import Success from "@app/assets/png/Successfulillustration.webp";
import { XIcon, XOctagon } from "lucide-react";
import { type FC } from "react";
import { Dialog } from ".";
import { Button } from "../Button/button";


type SucessDialoghProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: (state: string) => void;
  title: string;
  message: string;
};

export const ErrorDialog: FC<SucessDialoghProps> = ({
  open,
  setOpen,
  title,
  message,
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
      <Dialog.Content className="gap-4 w-[80vw] xl:w-[30vw] xl:max-w-[30vw]">
        <Dialog.Header className="-mr-3">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setOpen?.(false);
              }}
            >
              <XIcon className="text-red-500" />
            </button>
          </div>
        </Dialog.Header>

        <div className="w-full flex flex-col rounded-xl justify-center h-[200px] items-center">
          <XOctagon className="w-30 h-30 text-red-800 bg-red-300 p-3 rounded-xl"/>
          <h6 className="text-lg text-black font-bold pt-7">{title}</h6>
          <p>{message}</p>
        </div>

        <Dialog.Footer>
          <div className="w-full flex flex-col rounded-xl justify-center items-center">
            <Button
              onClick={handleClose}
              //disabled={!form.watch("interviewCategoryDownload")}
            >
              Tutup
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
