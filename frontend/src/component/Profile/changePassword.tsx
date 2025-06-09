import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import usePostChangePassword, { ChangePasswordReq } from "../../api/Dashboard/usePostChangePassword";
import { Button } from "../Button/button";
import { Dialog } from "../Dialog";
import { Input } from "../InputField/input";
import { Label } from "../Label";

type CorrectDialogProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    onClose?: (state: string) => void;
};

const passwordSchema = z.object({
    oldPass: z.string()
        .min(1, "Password lama tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Password mengandung karakter yang tidak diperbolehkan",
        }),
    newPass: z.string()
        .min(1, "Password baru tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Password mengandung karakter yang tidak diperbolehkan",
        }),
});

export const ChangePassword: FC<CorrectDialogProps> = ({
  open,
  setOpen,
//   onClose
}) => {
    const form = useForm<z.infer<typeof passwordSchema>>({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
        oldPass: "",
        newPass: "",
      }
    });
    const userId = localStorage.getItem("user") ?? "";
    const changePass = usePostChangePassword();

    useEffect(() => {
      const subscription = form.watch(() => {
        form.trigger(); // re-triggers validation on any field change
      });
      return () => subscription.unsubscribe();
    }, [form]);

    const handleSave = () => {
        const data: ChangePasswordReq = {
            userId: userId,
            oldPassword: form.getValues("oldPass"),
            newPassword: form.getValues("newPass")
        }
        changePass.mutate(data, {
            onSuccess: () => {
                console.log("sukses");
            }
        })
    } 
    const [showPasswordOld, setShowPasswordOld] = useState(false);
    const [showPasswordNew, setShowPasswordNew] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 w-[80vw] xl:w-[30vw] xl:max-w-[30vw]">
        <Dialog.Header className="relative">
            <h2 className="font-bold mt-1 text-xl">Change Password</h2>
            <button
                onClick={() => setOpen?.(false)}
                className="absolute top-1 right-2 cursor-pointer"
            >
                <XCircleIcon className="text-red-500" />
            </button>
        </Dialog.Header>

        <div className="w-full">
            <div className="flex flex-col mb-5">
              <Label>Old Password</Label>
              <div className="relative w-full">
                <Input
                  type={showPasswordOld ? "text" : "password"}
                  value={form.watch("oldPass")}
                  id="oldPass"
                  className="border border-gray-300 bg-white w-full pr-10" // add padding-right for the icon
                  placeholder="ex: zI1EPDBLrPtLr4V"
                  onChange={(e) => {
                    form.setValue("oldPass", e.target.value);
                  }}
                />
                <div
                  className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowPasswordOld(!showPasswordOld)}
                >
                  {showPasswordOld ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </div>
              </div>
            </div>
            <div className="flex flex-col mb-3">
              <Label>New Password</Label>
              <div className="relative w-full">
                <Input
                  type={showPasswordNew ? "text" : "password"}
                  value={form.watch("newPass")}
                  id="newPass"
                  className="border border-gray-300 bg-white w-full pr-10" // add padding-right for the icon
                  placeholder="ex: lYGQLFxW3PLL2Xn"
                  onChange={(e) => {
                    form.setValue("newPass", e.target.value);
                  }}
                />
                <div
                  className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowPasswordNew(!showPasswordNew)}
                >
                  {showPasswordNew ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </div>
              </div>
            </div>
        </div>
        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-center items-center">
            <Button
              onClick={handleSave}
              className="text-[14px]"
              disabled={!form.formState.isValid}
            >
              Simpan
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>

      
    </Dialog>
  );
};
