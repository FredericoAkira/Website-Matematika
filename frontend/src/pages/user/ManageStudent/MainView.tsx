import { PaginationState } from "@tanstack/react-table"
import { ChevronRight, EyeIcon, Filter, InboxIcon, PlusIcon, Search, Trash2Icon, TrashIcon, User, Users, XIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGetGroupList from "../../../api/Student/useGetGroupList"
import useGetStudentList from "../../../api/Student/useGetStudentTable"
import usePostDeleteGroup from "../../../api/Student/usePostDeleteGroup"
import usePostDeleteStudent, { StudentRequest } from "../../../api/Student/usePostDeleteStudent"
import { Button } from "../../../component/Button/button"
import { ConfirmationDialog } from "../../../component/Dialog/ConfirmationDialog"
import { GradeText } from "../../../component/helper"
import { Input } from "../../../component/InputField/input"
import { Paginations } from "../../../component/Pagination"
import { useMediaQuery } from "../../../component/useMediaQuery"
import { AddGroup } from "./AddGroup"
import { AddStudent } from "./AddStudent"
import { StudentFilter } from "./StudentFilter"
import { StudentListColumns } from "./Table/StudentListColumns"
import { StudentTable } from "./Table/StudentTable"

export type FilterStudent = {
    filterGrade: string;
    filterLevel: string;
};

export const ManageStudentPage = () => {
    const navigate = useNavigate()
    const [openFilter, setOpenFilter] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [searchMaterial, setSearchMaterial] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const [openStd, setOpenStd] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<FilterStudent>({
        filterGrade: "",
        filterLevel: "",
    });
    const {data: studentData, refetch} = useGetStudentList(
        pagination.pageIndex,
        pagination.pageSize,
        localStorage.getItem("user") ?? "",
        filters.filterLevel,
        filters.filterGrade,
        search
    );
    const {data: groupData, refetch: refetchGroup} = useGetGroupList(localStorage.getItem("user") ?? "");
    const deleteStudent = usePostDeleteStudent();
    const deleteGroup = usePostDeleteGroup();
    const [deletedId, setDeletedId] = useState<string>("");
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [deletedGroup, setDeletedGroup] = useState<string>("");
    const [deleteGroupConfirm, setDeleteGroupConfirm] = useState<boolean>(false);


    // add group
    const handleAdd = () => {
        setOpen(true)
    }

    const handleAddStudent = () => {
        setOpenStd(true)
    }

    const handleOpenDetail = (id: string) => {
        navigate(`/manageStudent/${id}`)
    }

    const handleDelete = (id: string) => {
        const payload: StudentRequest = {
            teacherId: localStorage.getItem("user") ?? "",
            studentId: id
        }
        deleteStudent.mutate(payload);
        refetch();
    }

    const handleFilterChange = (key: keyof FilterStudent, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            filterGrade: "",
            filterLevel: "",
        });
    };

    const handleDeleteGroup = (groupId: string) => {
        deleteGroup.mutate(groupId, {
          onSuccess: () => {
            refetchGroup();
          }
        });
    };

    const deleteClicked = (studentId: string) => {
        setDeletedId(studentId);
        setDeleteConfirm(true);
    }

    const deleteGroupClicked = (groupId: string) => {
        setDeletedGroup(groupId);
        setDeleteGroupConfirm(true);
    }

    const isMd = useMediaQuery("(max-width: 768px)");
    const isSm = useMediaQuery("(max-width: 640px");
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 8;
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMaterials = studentData?.data.content.slice(startIndex, endIndex);

    return (
        <div className="relative mr-5 overflow-y-hidden mb-3 w-[90dvw] md:w-[95dvw] lg:w-[97dvw]">
            {/* Kelompok Anda */}
            <div
                className="flex flex-row items-center justify-between border-solid bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3"
            >
                <div className="relative w-full border border-solid rounded-lg p-5 bg-white shadow-md m-3">
                    <p className="text-[20px] font-semibold">Kelompok Anda</p>
                    <hr className="my-2 border-gray-300" />
                        <div className="flex justify-end p-3">
                            <Button
                                trailingIcon={PlusIcon}
                                variant={"default"}
                                className="p-2 text-[12px]"
                                onClick={handleAdd}
                            >
                                Tambahkan
                            </Button>
                        </div>
                        {
                            groupData?.data && groupData?.data.length > 0 ?
                            (groupData?.data.map((item) => {
                                return (
                                    <div className="relative flex justify-between items-center border border-gray-300 rounded-lg p-3 bg-white mx-3 shadow-md">
                                        <div className="w-full flex flex-row items-center mx-3 gap-2 mb-2">
                                            <Users/>
                                            <div className="w-full ml-2">
                                                <div className="flex flex-col ">
                                                    <div className="flex flex-row gap-1 md:gap-3 items-center">
                                                        <p className="text-[14px] md:text-[20px] font-semibold">{item.groupName}</p>
                                                        <Trash2Icon
                                                            size={isSm ? 18 : 22}
                                                            className="cursor-pointer"
                                                            onClick={() => deleteGroupClicked(item.groupId)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        <p className={`${isSm ? "text-[12px]" : ""}`}>Anggota: </p>
                                                        {item.students.map(item => (
                                                            <p className={`${isSm ? "text-[12px]" : ""}`}>
                                                                {item.label}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-8 h-8 mr-3 cursor-pointer" onClick={() => navigate(`/manageStudent/group/${item.groupId}`)}/>
                                    </div>
                                )
                            }))
                            :
                            (
                                <div
                                    className={
                                        "flex flex-col items-center justify-center gap-1 text-xs text-neutral-tertiary py-4 transition"
                                    }
                                >
                                    <InboxIcon />
                                    <p>Anda belum memiliki kelompok.</p>
                                </div>
                            )
                        }
                </div>
            </div>

            {/* Murid Anda */}
            <div
                className="flex flex-row w-[90dvw] md:w-full md:mt-5 items-center justify-between border-solid bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3"
            >
                <div className="relative w-full border border-solid rounded-lg p-5 bg-white shadow-md m-3">
                    <p className="text-[20px] font-semibold">Murid Anda</p>
                    <hr className="my-2 border-gray-300" />
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                        <div className="flex flex-row gap-2 mt-2 mb-3 md:mb-0">
                            <Input
                                className={`border border-gray-400 ${isMd ? "w-full" : ""}`}
                                placeholder="Search Name"
                                value={searchMaterial}
                                onChange={({ target: { value } }) => setSearchMaterial(value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setSearch(searchMaterial ?? ""); // Update the search state when Enter is pressed
                                    }
                                }}
                            />
                            <Button
                                disabled={!searchMaterial}
                                onClick={() => {
                                    setPagination({
                                        pageIndex: 0,
                                        pageSize: 10,
                                    });
                                    setSearch(searchMaterial ?? "");
                                }}
                            >
                                {isSm ? <Search/> : "Search"}
                            </Button>
                            <Button
                                onClick={() => {
                                    setPagination({
                                        pageIndex: 0,
                                        pageSize: 10,
                                    });
                                setSearch("");
                                resetFilters();
                                }}
                                variant={"ghost"}
                                className={isSm ? "p-0 items-center" : ""}
                            >
                                {isSm ? <XIcon/> : "Reset"}
                            </Button>
                        </div>
                        <div className={`flex flex-row gap-2 ${isSm ? "w-full justify-between" : ""}`}>
                            <Button
                                trailingIcon={Filter}
                                variant={"default"}
                                className="p-2 text-[12px]"
                                onClick={() => setOpenFilter(true)}
                            >
                                Filter
                            </Button>
                            <Button
                                trailingIcon={PlusIcon}
                                variant={"default"}
                                className="p-2 text-[12px]"
                                onClick={handleAddStudent}
                            >
                                Tambahkan
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    {isSm ? (
                        <>
                        <div className="grid grid-cols-1 mb-5">
                            {paginatedMaterials?.map((item) => {
                                return (
                                    <div className="relative border border-solid rounded-lg bg-white mt-5 mx-3 shadow-md">
                                        <div className="flex flex-row items-center mx-3 gap-2 md:mb-2">
                                            <div className={`border-solid rounded-lg md:p-3 flex flex-col gap-2 bg-white w-full h-[100px] justify-center`}>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <div className="flex flex-row">
                                                        <User color="black"/>
                                                        <p className="text-[14px] font-semibold text-black mb-1">{item.studentName}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-[11px] font-semibold text-black">Kelas: {GradeText[item.grade as keyof typeof GradeText]}</p>
                                                        <p className="text-[11px] font-semibold text-black">Level: {item.level}</p>
                                                    </div>
                                                </div>
                                                {!isSm && (
                                                    <div>
                                                        <p className="text-[11px] font-semibold text-black">Materi terakhir: {item.latestMaterial}</p>
                                                        <p className="text-[11px] font-semibold text-black">Kuis terakhir: {item.latestQuiz}</p>
                                                    </div>
                                                ) }
                                            </div>
                                            <div className="flex flex-row items-center justify-start whitespace-nowrap">
                                                <Button
                                                    className="cursor-pointer"
                                                    leadingIcon={EyeIcon}
                                                    variant={"outline"}
                                                    onClick={() => handleOpenDetail(item.studentId)}
                                                    // disabled={!row.original.editable}
                                                ></Button>
                                                <Button
                                                    className="cursor-pointer"
                                                    leadingIcon={TrashIcon}
                                                    variant={"outline"}
                                                    onClick={() => deleteClicked(item.studentId)}
                                                    // disabled={!row.original.editable}
                                                ></Button>
                                            </div>
                                        </div>
                                    </div>
                            )})}
                        </div>
                            <Paginations
                                data={{
                                    pageIndex: pageIndex,
                                    totalPages: studentData?.data.totalPages ?? 1
                                }}
                                setPageIndex={setPageIndex}
                            />
                        </>
                    ) : (
                        <div className="mt-5 md:w-[85dvw] lg:w-full">
                            <StudentTable
                                columns={StudentListColumns(
                                        handleOpenDetail,
                                        deleteClicked
                                )}
                                data={studentData?.data.content.map((content) => ({
                                    id: content.studentId,
                                    actions: ["View", "Delete"],
                                    name: content.studentName,
                                    grade: content.grade,
                                    latestTopic: content.latestMaterial,
                                    latestQuiz: content.latestQuiz,
                                    status: content.level
                                })) ?? []}
                                pagination={
                                    studentData?.data
                                        ? {
                                            state: pagination,
                                            setState: setPagination,
                                            totalItem: studentData.data.totalElements,
                                            totalPage: studentData.data.totalPages,
                                            perPage: pagination.pageSize,
                                            currentPage: pagination.pageIndex,
                                        }
                                        : undefined
                                }
                            />
                        </div>
                    )}

                    <AddGroup
                        open={open}
                        setOpen={setOpen}
                        studentList={studentData?.data.content.map(item => (
                            {
                                id: item.studentId,
                                name: item.studentName
                            }
                        ))}
                        refetch={refetch}
                    />

                    <AddStudent
                        open={openStd}
                        setOpen={setOpenStd}
                        availStudent={studentData?.data.content.map(item => item.studentName)}
                    />

                    <StudentFilter
                        open={openFilter}
                        setOpen={setOpenFilter}
                        setFilter={handleFilterChange}
                        resetFilter={resetFilters}
                        filterValue={filters}
                    />

                    <ConfirmationDialog
                        open={deleteConfirm}
                        setOpen={setDeleteConfirm}
                        titleMessage={isSm ? "Hapus Murid?" : "Apakah Anda yakin ingin menghapus murid?"}
                        errorMessage="Pengguna ini akan dihapus dari daftar murid anda"
                        buttonNo={true}
                        onClose={() => handleDelete(deletedId)}
                    />

                    <ConfirmationDialog
                        open={deleteGroupConfirm}
                        setOpen={setDeleteGroupConfirm}
                        titleMessage={isSm ? "Hapus Kelompok?" : "Apakah Anda yakin ingin menghapus kelompok?"}
                        errorMessage="Kelompok ini akan dihapus dan riwayat chat akan hilang"
                        buttonNo={true}
                        onClose={() => handleDeleteGroup(deletedGroup)}
                    />
                </div>
            </div>
        </div>
    )
}