/* eslint-disable react-hooks/exhaustive-deps */
import { PencilIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import usePostChangeData, { ChangeDataReq } from "../../api/Dashboard/usePostChangeData";
import useGetLOV from "../../api/useGetLOV";
import avatar from "../../assets/png/avatar.png";
import { Avatar } from "../Avatar";
import { Button } from "../Button/button";
import { Dialog } from "../Dialog";
import { Input } from "../InputField/input";
import { InputSelect } from "../InputSelect/InputSelect";
import { Label } from "../Label";
import { ChangePassword } from "./changePassword";
import { ChangePhoto } from "./changePhoto";


type CorrectDialogProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    onClose?: (state: string) => void;
    data?: {
        username: string;
        profilePhoto: string;
        email: string;
        grade: string;
    }
};

export const Profile: FC<CorrectDialogProps> = ({
  open,
  setOpen,
  data,
//   onClose
}) => {
    const form = useForm();
    const [openUploadDialog, setOpenUploadDialog] = useState(false)
    const [openChangePass, setOpenChangePass] = useState(false)
    const saveChanges = usePostChangeData();
    // const handleClose = () => {
    //     setOpen(false);
    //     if (onClose) {
    //     onClose("apply");
    //     }
    // };
    const optionGrade = useGetLOV();
    const [searchValue, setSearchValue] = useState("")
    useEffect(() => {
        optionGrade.mutate({
            type: "gradelov",
            search: searchValue
        })
    }, [searchValue]);

    useEffect(() => {
        form.setValue("username", data?.username);
        form.setValue("email", data?.email)
        form.setValue("grade", data?.grade)
    }, [data, form]);

    const handleSave = () => {
        const data: ChangeDataReq = {
            userId: localStorage.getItem("user") ?? "",
            username: form.getValues("username"),
            email: form.getValues("email")
        }

        saveChanges.mutate(data, {
            onSuccess: () => {
                console.log("Sukses");
            }
        })
        form.setValue("username", data?.username);
        form.setValue("email", data?.email)
    }


  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 items-center w-[80vw] xl:w-[30vw] xl:max-w-[30vw]">
        <Dialog.Header className="relative">
            <button
                onClick={() => {
                    form.setValue("username", data?.username);
                    form.setValue("email", data?.email)
                    setOpen?.(false)
                }}
                className="absolute top-1 right-2"
            >
                <XCircleIcon className="text-red-500 cursor-pointer" />
            </button>

            <div className="flex justify-center items-center">
                <Avatar className="w-[150px] h-[150px] shadow-md">
                <Avatar.Image src={data?.profilePhoto ?? avatar} />
                <Avatar.Fallback>
                    nameError
                </Avatar.Fallback>
                </Avatar>

                <div className="mt-28 bg-blue-200 rounded-2xl p-2 -ml-10 z-10">
                <PencilIcon
                    className="text-[#0291E5] cursor-pointer"
                    onClick={() => setOpenUploadDialog(true)}
                />
                </div>
            </div>
        </Dialog.Header>

        <div className="w-full">
            <div className="flex flex-col mb-5">
                <Label>Username</Label>
                <Input
                    value={form.watch("username")}
                    id="username"
                    className="border border-gray-300 bg-white"
                    placeholder="Test"
                    onChange={(e) => {
                        form.setValue("username", e.target.value)
                    }}
                />
            </div>
            <div className="flex flex-col mb-3">
                <Label>Email</Label>
                <Input
                    value={form.watch("email")}
                    id="email"
                    className="border border-gray-300 bg-white"
                    placeholder="Test"
                    onChange={(e) => {
                        form.setValue("email", e.target.value)
                    }}
                />
            </div>
            <div className="flex flex-col mb-3">
                <InputSelect
                    onChange={(value) => {
                        form.setValue("grade", value?.value ?? "");
                    }}
                    handleSearch={setSearchValue}
                    options={optionGrade.data?.data.data.map((item) => (
                        {
                            meaning: item.id,
                            value: item.name
                        }
                    ))}
                    name="grade"
                    label="Grade"
                    required={false}
                    value={form.watch("grade")}
                />
            </div>
            <div className="flex flex-col">
                <p className="text-xs cursor-pointer text-blue-400" onClick={() => setOpenChangePass(true)}>change password</p>
            </div>
        </div>
        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-center items-center">
            <Button
              onClick={handleSave}
              className="text-[14px]"
            >
              Simpan
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>

        <ChangePassword
            open={openChangePass}
            setOpen={setOpenChangePass}
        />

        <ChangePhoto
            open={openUploadDialog}
            setOpen={setOpenUploadDialog}
        />

    </Dialog>
  );
};
