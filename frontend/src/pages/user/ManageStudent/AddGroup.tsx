/* eslint-disable @typescript-eslint/no-explicit-any */
import { XIcon } from "lucide-react";
import { useState, type FC } from "react";
import usePostAddGroup, { AddGroupRequest } from "../../../api/Student/usePostAddGroup";
import usePostCheckGroup from "../../../api/Student/usePostCheckGroup";
import { Button } from "../../../component/Button/button";
import { Dialog } from "../../../component/Dialog";
import { ConfirmationDialog } from "../../../component/Dialog/ConfirmationDialog";
import { ErrorDialog } from "../../../component/Dialog/ErrorDialog";
import { SuccessDialog } from "../../../component/Dialog/SuccessDialog";
import { Student } from "../../../component/helper";
import { Input } from "../../../component/InputField/input";
import AddMore from "./AddMore";

type AddToRequisitionProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: (state: string) => void;
  studentList?: {
    id: string,
    name: string
  }[]
  refetch:() => void;
};

export const AddGroup: FC<AddToRequisitionProps> = ({
  open,
  setOpen,
  studentList,
  refetch
  //onClose,
}) => {
  const [dataTopic, setDataTopic] = useState<Student[]>([]);
  const [isApply, setIsApply] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [groupName, setGroupName] = useState("");
  const checkGroup = usePostCheckGroup();
  const addGroup = usePostAddGroup();

  const checkingGroup = () => {
    const payload: AddGroupRequest = {
      groupName: groupName,
      teacherId: localStorage.getItem("user") ?? "",
      studentIds: dataTopic.map(item => String(item.id))
    };

    checkGroup.mutate(payload, {
      onSuccess: (data) => {
        if(data.data.toLowerCase() === "exist"){
          setIsApply(true);
        }else{
          handleAdd(payload)
        }
      }
    })
  }
  const handleAdd = (payload: AddGroupRequest) => {
    addGroup.mutate(payload, {
      onSuccess: () => {
        setIsSuccess(true); // Open Popup B
      },
      onError: () => {
        setIsFailed(true);
      },
    });
  };

  const handleClose = () => {
    setGroupName("");
    setDataTopic([]);
    refetch();
    setOpen(false);
  };

  const handleRemoveAttendee = (e: any, index: number) => {
    e.preventDefault();
    setDataTopic((prevAttendees: any) =>
      prevAttendees.filter((_: any, i: number) => i !== index),
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 w-[70vw] max-w-[90vw]">
        <Dialog.Header className="-mr-3">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="cursor-pointer"
            >
              <XIcon className="text-red-500" />
            </button>
          </div>
        </Dialog.Header>

        <h2 className="text-lg font-semibold">Tambah Kelompok</h2>
        
        <div className="w-full">
          <label className="text-left text-xs text-neutral-default peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              Masukkan nama kelompok
          </label>
          <Input
              className="border border-gray-400 w-full"
              placeholder="ex: Kelompok Satu"
              value={groupName}
              onChange={({ target: { value } }) => {
                  setGroupName(value)
              }}
          />
        </div>

        <div>
          <AddMore
            dataAttendee={dataTopic}
            setDataAttendee={setDataTopic}
            handleRemoveAttendee={handleRemoveAttendee}
            optionalOption={studentList}
            text="Tambah Murid"
            type=""
            title="Masukkan username murid"
            user={true}
          />
        </div>

        <Dialog.Footer>
          <Button
            onClick={checkingGroup}
            disabled={groupName.length <= 0 || dataTopic.length <= 0}
          >
            Tambahkan
          </Button>

          <ConfirmationDialog
            open={isApply}
            setOpen={setIsApply}
            titleMessage="Kelompok Sudah Ada!"
            errorMessage="Kelompok dengan murid yang sama sudah ada, tambahkan lagi?"
            buttonNo={true}
            onClose={() => handleAdd(
              {
                groupName: groupName,
                teacherId: localStorage.getItem("user") ?? "",
                studentIds: dataTopic.map(item => String(item.id))
              }
            )}
          />

          <SuccessDialog
            open={isSuccess}
            setOpen={setIsSuccess}
            title="Sukses Menambahkan Kelompok"
            message={`Kelompok "${groupName}" berhasil dibuat!`}
            onClose={handleClose}
          />

          <ErrorDialog
            open={isFailed}
            setOpen={setIsFailed}
            title="Error Menambahkan Kelompok"
            message={`Terjadi kesalahan saat menambahkan kelompok "${groupName}"! Silahkan login kembali dan coba lagi!`}
            onClose={handleClose}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
