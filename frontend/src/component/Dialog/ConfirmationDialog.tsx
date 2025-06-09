/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { type FC } from "react";
import { Dialog } from ".";
import { Button } from "../Button/button";

type WarningDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  errorMessage?: string;
  titleMessage?: string;
  onClose?: (state: string) => void;
  buttonNo?: boolean;
};

export const ConfirmationDialog: FC<WarningDialogProps> = ({
  open,
  setOpen,
  errorMessage,
  titleMessage,
  onClose,
  buttonNo,
}) => {
  const button = buttonNo ?? true;
  const title = titleMessage ? titleMessage : "Warning!";
  const messageArray = [];
  let messageString = "";
  if (errorMessage) {
    if (typeof errorMessage == "string") {
      messageString = errorMessage.toString();
    } else if (Object.keys(errorMessage).length > 0) {
      for (const [key, value] of Object.entries(errorMessage)) {
        const messageArrayElement: any = {};
        messageArrayElement["field"] = key;
        messageArrayElement["message"] = value;
        if (
          Object.prototype.hasOwnProperty.call(
            messageArrayElement["message"],
            "root",
          )
        ) {
          messageArrayElement["message"] =
            messageArrayElement["message"]["root"];
        }
        messageArray.push(messageArrayElement);
      }
    }
  }

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
      <Dialog.Content
        className="gap-4"
        icon={
          <div
            className={`p-2 rounded-full border-4 ${
              button
                ? "border-blue-400 text-blue-600"
                : "border-success-100 bg-success-100 text-success-600"
            }`}
          >
            {button ? <AlertTriangleIcon /> : <CheckCircleIcon />}
          </div>
        }
      >
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>
            {messageArray.length > 0 ? (
              messageArray.map((messageElement) => (
                <>{messageElement.message.message}</>
              ))
            ) : (
              <>{messageString}</>
            )}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          {button && (
            <Dialog.Close asChild>
              <Button variant={"outline"}>No</Button>
            </Dialog.Close>
          )}
          <Dialog.Close asChild>
            <Button onClick={handleClose}>{button ? "Yes" : "Ok"}</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
