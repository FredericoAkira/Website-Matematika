import { Check, Pen, Plus, Save, SchoolIcon, Sword, Trash2Icon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../api/auth";
import useGetStudentOption from "../../../../api/Student/useGetStudentOptions";
import usePostCheckGroup from "../../../../api/Student/usePostCheckGroup";
import usePostDeleteGroup from "../../../../api/Student/usePostDeleteGroup";
import usePostEditGroup, { EditGroupRequest } from "../../../../api/Student/usePostEditGroup";
import { Button } from "../../../../component/Button/button";
import { ConfirmationDialog } from "../../../../component/Dialog/ConfirmationDialog";
import { ErrorDialog } from "../../../../component/Dialog/ErrorDialog";
import { SuccessDialog } from "../../../../component/Dialog/SuccessDialog";
import { InputSelect } from "../../../../component/InputSelect/InputSelect";
import { useMediaQuery } from "../../../../component/useMediaQuery";
import { UserRoleEnum } from "../../../../component/userRole";

type studentData = {
    studentId: string,
    studentName: string,
    level: string,
    grade: string
}

interface IStdContent {
    data: studentData[],
    groupName: string,
    groupId: string,
    refetch: () => void
}

export const StudentContent: React.FC<IStdContent> = ({
    data,
    groupName,
    groupId,
    refetch
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isApply, setIsApply] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const [groupEmpty, setGroupEmpty] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<string>("");
    const [dataStudent, setDataStudent] = useState<studentData[]>([]);
    const auth = useAuthStore((state) => state.role) ?? undefined;
    const {data: studentOption} = useGetStudentOption(
        localStorage.getItem("user") ?? "",
        search
    );
    const checkGroup = usePostCheckGroup();
    const editGroup = usePostEditGroup();
    const deleteGroup = usePostDeleteGroup();
    const navigate = useNavigate();

    const [deletedId, setDeletedId] = useState<string>("");
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const isSm = useMediaQuery("(max-width: 640px");

    useEffect(() => {
        setDataStudent(data)
    }, [data]);

    const handleAddStudent = (studentId: string) => {
        const studentToAdd = studentOption?.data?.find(student => student.studentId === studentId);
        if (studentToAdd) {
            setDataStudent(prev => [...prev, studentToAdd]);
        }
        setSelected("");
    };

    const handleDeleteClicked = (studentId: string) => {
        setDeletedId(studentId);
        setDeleteConfirm(true);
    }

    const handleDeleteStudent = (studentId: string) => {
        setDataStudent(prev => prev.filter(student => student.studentId !== studentId));
    };

    const handleCancel = () => {
        setDataStudent(data);
        setSelected("");
        setIsEdit(false);
    };

    const handleSubmit = () => {
        const payload: EditGroupRequest = {
            groupId: groupId,
            groupName: groupName,
            teacherId: localStorage.getItem("user") ?? "",
            studentIds: dataStudent.map(item => String(item.studentId))
        };

        checkGroup.mutate(payload, {
            onSuccess: () => {
                if(dataStudent.length === 0){
                    setGroupEmpty(true);
                }
                else{
                    setIsApply(true);
                }
            }
        })
    }

    const handleAddFinal = (payload: EditGroupRequest) => {
        editGroup.mutate(payload, {
          onSuccess: () => {
            setIsSuccess(true); // Open Popup B
          },
          onError: () => {
            setIsFailed(true);
          },
        });
    };

    const dataStudentNames = new Set(dataStudent.map(s => s.studentName));

    const filtered = studentOption?.data.filter(
    option => !dataStudentNames.has(option.studentName)
    );

    const handleConfirmGroupEmpty = () => {
        deleteGroup.mutate(groupId, {
          onSuccess: () => {
            navigate(-1);
          }
        });
    };

    return (
        <div className="relative w-full">
            <div className="flex flex-col items-center bg-white/70 rounded-lg shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 m-3">
                <div className="flex flex-col gap-3 w-full">
                    {auth === UserRoleEnum.Teacher && !isEdit && (
                        <div className=" w-full flex flex-row justify-end">
                            <Button className="py-1.5 px-3 text-[13px]" leadingIcon={Pen} onClick={() => setIsEdit(true)}>
                                Edit
                            </Button>
                        </div>
                    )}
                    {dataStudent.map(item => (
                        <div className="flex flex-row w-full items-center justify-between border border-solid rounded-lg md:p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)]">
                            <div className="w-full flex flex-row items-center m-3 gap-2">
                                <div className="w-full flex flex-row justify-between items-center">
                                    <div className="flex flex-col justify-between">
                                        <p className="text-[24px] font-semibold ml-5">{item.studentName}</p>
                                        <div className="flex flex-row ml-5 gap-2">
                                            <span className="flex flex-row items-center gap-1"> <SchoolIcon/> Kelas: {item.grade} </span>
                                            <span className="flex flex-row items-center gap-1"> <Sword/> Level: {item.level} </span>
                                        </div>
                                    </div>
                                    {
                                        isEdit && (
                                            <div className="-mt-6 md:mt-0">
                                                <Trash2Icon
                                                    size={30}
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDeleteClicked(item.studentId)}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                    {isAdding && (
                        <div className="flex flex-col gap-3">
                            <div>
                                <InputSelect
                                    onChange={(value) => {
                                        setSelected(value?.value ?? "");
                                    }}
                                    handleSearch={setSearch}
                                    name={"studentName"}
                                    required={false}
                                    label="Find Student Name"
                                    options={
                                        filtered?.map((item) => (
                                            {
                                                meaning: `${item.studentName} - ${item.grade ?? ""}`,
                                                value: item.studentId
                                            }
                                        )) ?? []
                                    }
                                    placeholder="Find name"
                                    value={selected}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button className="py-1.5 px-3 text-[14px]" leadingIcon={Check} onClick={() => handleAddStudent(selected)}>OK</Button>
                                <Button className="py-1.5 px-3 text-[14px]" leadingIcon={XIcon} onClick={() => setIsAdding(false)}>Tutup</Button>
                            </div>
                        </div>
                    )}
                    {isEdit && (
                        <div className=" w-full flex flex-col md:flex-row justify-between gap-2 md:gap-0">
                            <Button className="py-1.5 px-3 text-[14px]" leadingIcon={Plus} onClick={() => setIsAdding(true)}>Tambahkan</Button>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Button className="py-1.5 px-3 text-[14px]" leadingIcon={Save} onClick={handleSubmit}>Simpan</Button>
                                <Button className="py-1.5 px-3 text-[14px]" leadingIcon={XIcon} onClick={handleCancel}>Batal</Button>
                            </div>
                        </div>
                    )}
                </div>
                <ConfirmationDialog
                    open={isApply}
                    setOpen={setIsApply}
                    titleMessage="Simpan Kelompok?"
                    errorMessage={"Simpan perubahan pada kelompok?"}
                    onClose={() => handleAddFinal(
                        {
                            groupId: groupId,
                            groupName: groupName,
                            teacherId: localStorage.getItem("user") ?? "",
                            studentIds: dataStudent.map(item => String(item.studentId))
                        }
                    )}
                />
                <ConfirmationDialog
                    open={groupEmpty}
                    setOpen={setGroupEmpty}
                    titleMessage="Kelompok Anda Kosong!"
                    errorMessage={"Menyimpan perubahan akan menghapus kelompok dan riwayat chat sepenuhnya, lanjutkan?"}
                    onClose={() => handleConfirmGroupEmpty()}
                />
                <SuccessDialog
                    open={isSuccess}
                    setOpen={setIsSuccess}
                    title="Sukses Mengubah data kelompok"
                    message={`Data Kelompok berhasil diubah`}
                    onClose={() => {
                        setIsEdit(false);
                        setIsAdding(false);
                        setIsSuccess(false);
                        refetch()
                    }}
                />
                <ErrorDialog
                    open={isFailed}
                    setOpen={setIsFailed}
                    title="Gagal Mengubah data kelompok"
                    message={`Terjadi kesalahan saat menyimpan perubahan data kelompok! Silahkan login kembali dan coba lagi!`}
                    onClose={() => {
                        setIsEdit(false);
                        setIsAdding(false);
                        setIsFailed(false);
                        refetch()
                    }}
                />
                <ConfirmationDialog
                    open={deleteConfirm}
                    setOpen={setDeleteConfirm}
                    titleMessage={isSm ? "Hapus Anggota?" : "Apakah Anda yakin ingin menghapus anggota kelompok?"}
                    errorMessage="Pengguna ini akan dihapus dari daftar anggota kelompok ini"
                    buttonNo={true}
                    onClose={() => handleDeleteStudent(deletedId)}
                />
            </div>
        </div>
    )
}