import { XCircleIcon } from "lucide-react";
import { type FC } from "react";
import { Button } from "../Button/button";
import { Dialog } from "../Dialog";


type CorrectDialogProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    onClose?: (notifId: string, status: string) => void;
    data?: {
        notifId: string;
        header: string;
        content: string;
        status: string;
    }
};

export const DetailDialog: FC<CorrectDialogProps> = ({
  open,
  setOpen,
  data,
  onClose
}) => {
    const handleClose = (status: string) => {
        setOpen(false);
        if (onClose) {
          onClose(data?.notifId ?? "", status);
        }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 w-[30vw] max-w-[30vw]">
        <Dialog.Header className="relative">
            <button
                onClick={() => {
                    setOpen(false)
                }}
                className="absolute top-1 right-2"
            >
                <XCircleIcon className="text-red-500" />
            </button>

            <div className="flex justify-center items-center">
                <h2>{data?.header}</h2>
            </div>
        </Dialog.Header>

        <div className="w-full">
            <p>{data?.content}</p>
        </div>
        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-around items-center">
            <Button
              onClick={() => handleClose("ACCEPTED")}
              className="text-[14px]"
            >
              Terima
            </Button>
            <Button
              onClick={() => handleClose("REJECTED")}
              className="text-[14px]"
            >
              Tolak
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
