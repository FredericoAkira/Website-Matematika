import { XCircleIcon } from "lucide-react";
import { useState, type FC } from "react";
import usePostChangeProfile, { ChangeProfileReq } from "../../api/Dashboard/usePostChangeProfile";
import usePostCheckTopic from "../../api/Topic/usePostCheckTopic";
import { Button } from "../Button/button";
import { Dialog } from "../Dialog";
import { Dropzone } from "../Dropzone";
import { Label } from "../Label";


type CorrectDialogProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    // onClose?: (state: string) => void;
};

export const ChangePhoto: FC<CorrectDialogProps> = ({
  open,
  setOpen
}) => {
    const [imageData, setImageData] = useState<File>();
    const uploadFile = usePostCheckTopic();
    const userId = localStorage.getItem("user") ?? "";
    const changePhoto = usePostChangeProfile();
    
    const handleSave = async () => {
        let imageUrl = "";
        if (imageData){
            imageUrl = await uploadFile.mutateAsync(imageData);
        }

        const data: ChangeProfileReq = {
            itemOne: userId,
            itemTwo: imageUrl
        }

        changePhoto.mutate(data, {
            onSuccess: () => {
                console.log("sukses");
                setOpen(false);
            }
        })
    }


  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 w-[90vw] xl:w-[30vw] xl:max-w-[30vw]">
        <Dialog.Header className="relative">
            <h2 className="font-bold mt-1 text-xl">Change Profile Picture</h2>
            <button
                onClick={() => setOpen?.(false)}
                className="absolute top-1 right-2 cursor-pointer"
            >
                <XCircleIcon className="text-red-500" />
            </button>
        </Dialog.Header>

        <div className="w-full">
            <div className="flex flex-col">
                <Label>New Profile Photo</Label>
                <Dropzone
                    multiple={false}
                    onDrop={(files) => {
                        const file = files[0];
                        setImageData(file);
                    }}
                    onDelete={() => setImageData(undefined)}
                />
            </div>
        </div>
        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-center items-center">
            <Button
              onClick={handleSave}
              className="text-[14px]"
              disabled={!imageData}
            >
              Simpan
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>

      
    </Dialog>
  );
};
