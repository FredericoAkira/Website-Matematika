/* eslint-disable react-hooks/exhaustive-deps */
import { PaginationState } from "@tanstack/react-table";
import { BookmarkCheck, Search, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetMaterialList from "../../../api/Material/useGetMaterialList";
import useGetLOV from "../../../api/useGetLOV";
import { Button } from "../../../component/Button/button";
import { Input } from "../../../component/InputField/input";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { Paginations } from "../../../component/Pagination";
import { useMediaQuery } from "../../../component/useMediaQuery";

export const MaterialListPage = () => {
    const [searchMaterial, setSearchMaterial] = useState<string | undefined>(
        undefined
    );
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();
    const [filterGrade, setFilterGrade] = useState("");
    const [filterDiff, setFilterDiff] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const { data: materialList } = useGetMaterialList(
        pagination.pageIndex,
        pagination.pageSize,
        localStorage.getItem("user") ?? "",
        filterGrade,
        search,
        filterDiff,
        "material"
    );

    const itemsPerPage = 6;
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMaterials = materialList?.data.content.slice(startIndex, endIndex);

    const [searchGrade, setSearchGrade] = useState<string>("");
    const optionFilterGrade = useGetLOV();

    useEffect(() => {
        optionFilterGrade.mutate({
        type: "gradelov",
        search: searchGrade
        })
    }, [searchGrade]);

    const [searchDiff, setSearchDiff] = useState<string>("");
    const optionFilterDiff = useGetLOV();
    
    useEffect(() => {
        optionFilterDiff.mutate({
            type: "levellov",
            search: searchDiff
        })
    }, [searchDiff]);

    const isSm = useMediaQuery("(max-width: 640px)");

    return (
        <div className="relative mr-5 overflow-y-hidden mb-3">
            <div
                className="flex flex-row w-[90dvw] md:w-full items-center justify-between border-solid bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3"
            >
                <div className="flex flex-col w-full mt-3 mx-3">
                    <div className="w-full">
                        <p className="text-[20px] font-semibold">Materi Pembelajaran</p>
                        <hr className="w-full my-2 border-gray-300" />
                    </div>

                    <div className="flex flex-col-reverse md:flex-row w-full justify-between md:items-center mt-3">
                        <div className="flex flex-row gap-2">
                            <Input
                                className={`border border-gray-400 ${isSm ? "w-full" : ""}`}
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
                                    setSearchMaterial("");
                                    setFilterGrade("");
                                    setFilterDiff("");
                                }}
                                variant={"ghost"}
                                className={isSm ? "p-0 items-center" : ""}
                            >
                                {isSm ? <XIcon/> : "Reset"}
                            </Button>
                        </div>

                        <div className="flex flex-row gap-2 items-center mb-2 md:mb-0">
                            <div className={`md:mr-3 md:-mt-1 ${isSm ? "w-full" : ""}`}>
                                <InputSelect
                                    onChange={(value) => {
                                        setFilterGrade(value?.value ?? "");
                                    }}
                                    handleSearch={setSearchGrade}
                                    options={optionFilterGrade.data?.data.data.map((item) => (
                                        {
                                            meaning: item.id,
                                            value: item.name
                                        }
                                    ))}
                                    name="gradeFilter"
                                    label=" "
                                    required={false}
                                    value={filterGrade}
                                    placeholder="Filter Grade"
                                />
                            </div>
                            <div className={`md:mr-3 md:-mt-1 ${isSm ? "w-full" : ""}`}>
                                <InputSelect
                                    onChange={(value) => {
                                        setFilterDiff(value?.value ?? "");
                                    }}
                                    handleSearch={setSearchDiff}
                                    options={optionFilterDiff.data?.data.data.map((item) => (
                                        {
                                            meaning: item.name,
                                            value: item.id
                                        }
                                    ))}
                                    name="difficultyDiff"
                                    label=" "
                                    required={false}
                                    value={filterDiff}
                                    placeholder="Filter Difficulty"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 mb-5">
                        {paginatedMaterials?.map((item) => {
                            return (
                                <div className="relative border-solid rounded-lg p-3 bg-white mt-5 mx-3 shadow-md">
                                    <div className="flex flex-row items-center mx-3 gap-2 mb-2">
                                        <div className={`border-solid rounded-lg p-3 flex flex-row gap-2 ${item.difficulty === "Novice" ? "bg-[#5A86A0]" : item.difficulty === "Hard" ? "bg-[#00639D]" : "bg-[#2F81B1]"} w-full h-[100px]`}>
                                            <BookmarkCheck color="white"/>
                                            <div>
                                                <p className="text-[14px] font-semibold text-white mb-1">{item.materialName}</p>
                                                <p className="text-[12px] font-semibold text-white">Kelas: {item.grade}</p>
                                                <p className="text-[12px] font-semibold text-white">Kesulitan: {item.difficulty}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-end pr-3">
                                        <Button
                                            className="p-3 right-0"
                                            onClick={() => navigate(`/learn/${item.materialName}`)}
                                        >
                                            Pelajari
                                        </Button>
                                    </div>
                                </div>
                        )})}
                    </div>
                    <Paginations
                        data={{
                            pageIndex: pageIndex,
                            totalPages: materialList?.data.totalPages ?? 1
                        }}
                        setPageIndex={setPageIndex}
                    />
                </div>
            </div>
        </div>
    )};
