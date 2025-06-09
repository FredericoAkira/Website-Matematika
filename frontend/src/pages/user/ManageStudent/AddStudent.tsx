/* eslint-disable @typescript-eslint/no-explicit-any */
import { XIcon } from "lucide-react";
import { useState, type FC } from "react";
import usePostAddStudent, { AddStudentRequest } from "../../../api/Student/usePostAddStudent";
import { Button } from "../../../component/Button/button";
import { Dialog } from "../../../component/Dialog";
import { ConfirmationDialog } from "../../../component/Dialog/ConfirmationDialog";
import { ErrorDialog } from "../../../component/Dialog/ErrorDialog";
import { SuccessDialog } from "../../../component/Dialog/SuccessDialog";
import { Student } from "../../../component/helper";
import AddMore from "./AddMore";

type AddToRequisitionProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: (state: string) => void;
  availStudent?: string[];
};

export const AddStudent: FC<AddToRequisitionProps> = ({
  open,
  setOpen,
  availStudent,
  //onClose,
}) => {
  const [query, setQuery] = useState<string>("");
  const [dataTopic, setDataTopic] = useState<Student[]>([]);
  const [isApply, setIsApply] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const addStudent = usePostAddStudent();
  const handleRemoveTopics = (e: any, index: number) => {
    e.preventDefault();
    setDataTopic((prevAttendees: any) =>
      prevAttendees.filter((_: any, i: number) => i !== index),
    );
  };

  const checkData = () => {
    const isAnyTopicExist = dataTopic.some(item => availStudent?.includes(item.name));
    if(isAnyTopicExist){
      setIsApply(true);
    }
    handleAdd()
  };

  const handleAdd = () => {
    const payload: AddStudentRequest = {
      teacherId: localStorage.getItem("user") ?? "",
      studentIds: dataTopic.map((item) => String(item.id))
    };

    addStudent.mutate(payload, {
      onSuccess: () => {
        setIsSuccess(true); // Open Popup B
      },
      onError: () => {
        setIsFailed(true);
      },
    });
  };

  const handleClose = () => {
    setQuery("");
    // refetch();
    setOpen(false);
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

        <h2 className="text-lg font-semibold">Tambahkan murid</h2>
          <AddMore
            dataAttendee={dataTopic}
            setDataAttendee={setDataTopic}
            handleRemoveAttendee={handleRemoveTopics}
            text="Tambahkan username"
            type="student"
            title="Masukkan username siswa yang ingin dijadikan murid"
            user={true}
            availStudent={availStudent}
          />

        <Dialog.Footer>
          <Button
            onClick={checkData}
            disabled={query.length <= 0 && dataTopic.length <= 0}
          >
            Tambahkan
          </Button>

          <ConfirmationDialog
            open={isApply}
            setOpen={setIsApply}
            titleMessage="Attention!"
            errorMessage="Student already exist!"
            onClose={() => setIsApply(false)}
          />

          <SuccessDialog
            open={isSuccess}
            setOpen={setIsSuccess}
            title="Sukses Menambahkan Murid"
            message={`Notifikasi penambahan telah dikirimkan ke ${query}. Menunggu konfirmasi!`}
            onClose={handleClose}
          />

          <ErrorDialog
            open={isFailed}
            setOpen={setIsFailed}
            title="Gagal Menambahkan Murid"
            message={`Terjadi kesalahan saat proses pengiriman notifikasi! Silahkan login kembali dan coba lagi!`}
            onClose={handleClose}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
