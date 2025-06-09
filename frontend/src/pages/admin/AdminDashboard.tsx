/* eslint-disable react-hooks/exhaustive-deps */
import { ChartColumnIncreasingIcon, ChevronDown, ChevronRight, File, NotebookPen, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetDataAdmin from "../../api/Dashboard/useGetDataAdmin";
import useGetLOV from "../../api/useGetLOV";
import { Button } from "../../component/Button/button";
import SideBarChart from "../../component/Chart/barChartHorizontal";
import DonutChart from "../../component/Chart/donutChart";
import Legend from "../../component/Chart/legend";
import { InputSelect } from "../../component/InputSelect/InputSelect";
import TodoList from "../../component/ToDo";
import { useMediaQuery } from "../../component/useMediaQuery";

export const AdminDashboard = () => {
    const userId = localStorage.getItem("user") ?? "";
    const navigate = useNavigate();

    const [filterMateri, setFilterMateri] = useState("grade");
    const [searchMateri, setSearchMateri] = useState<string>("");
    const optionDashboardMateri = useGetLOV();

    const [filterTopik, setFilterTopik] = useState("grade");
    const [searchTopik, setSearchTopik] = useState<string>("");
    const optionDashboardTopik = useGetLOV();
    
    const [filterKuis, setFilterKuis] = useState("grade");
    const [searchKuis, setSearchKuis] = useState<string>("");
    const optionDashboardKuis = useGetLOV();

    const [filterSiswa, setFilterSiswa] = useState("grade");
    const [searchSiswa, setSearchSiswa] = useState<string>("");
    const optionDashboardSiswa = useGetLOV();

    const {data: detail} = useGetDataAdmin(userId, filterMateri, filterTopik, filterKuis, filterSiswa);
    const isMd = useMediaQuery("(max-width: 768px)");

     useEffect(() => {
        optionDashboardMateri.mutate({
            type: "filterlov",
            search: searchMateri
        })
     }, [searchMateri]);
 
     useEffect(() => {
         optionDashboardTopik.mutate({
            type: "filterlov",
            search: searchTopik
         })
     }, [searchTopik]);

     useEffect(() => {
        optionDashboardKuis.mutate({
            type: "filterlov",
            search: searchKuis
         })
     }, [searchKuis]);

     useEffect(() => {
        optionDashboardSiswa.mutate({
            type: "filterlov",
            search: searchSiswa
        })
     }, [searchSiswa]);

    const [isOpen, setIsOpen] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    const [isOpenStd, setIsOpenStd] = useState(true);
    const contentRefStd = useRef<HTMLDivElement>(null);
    const [maxHeightStd, setMaxHeightStd] = useState("0px");

    useEffect(() => {
        if (contentRef.current) {
            setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
        }
    }, [isOpen]);

    useEffect(() => {
        if (contentRefStd.current) {
            setMaxHeightStd(isOpenStd ? `${contentRefStd.current.scrollHeight}px` : "0px");
        }
    }, [isOpenStd]);

    const [parentWidth, setParentWidth] = useState<number>(0);
    useEffect(() => {
    if (contentRefStd.current) {
        setParentWidth(contentRefStd.current.offsetWidth);
    }

    const handleResize = () => {
        if (contentRefStd.current) {
        setParentWidth(contentRefStd.current.offsetWidth);
        }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative overflow-y-hidden">
            {/* Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 translate-y-3 mb-3">
                {/* Accordion Section */}
                <div className="col-span-2 mt-5 mx-3">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex justify-between items-center cursor-pointer p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <ChartColumnIncreasingIcon />
                            <h2 className="text-xl font-semibold">Total Konten</h2>
                        </div>
                        <ChevronDown
                            className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </div>

                    {/* Collapsible Content */}
                    <div
                        ref={contentRef}
                        className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-md mb-4 -mt-2"
                        style={{ maxHeight }}
                    >
                        <div className="flex flex-col gap-4 my-4 w-full">
                            {/* Latest Material */}
                            <div className="relative border border-solid rounded-lg p-3 bg-white shadow-md m-3">
                                <p className="text-[20px] font-semibold">Materi</p>
                                <hr className="my-2 border-gray-300" />
                                <div className="mb-2">
                                    <InputSelect
                                        onChange={(value) => {
                                            setFilterMateri(value?.value ?? "");
                                        }}
                                        handleSearch={setSearchMateri}
                                        options={optionDashboardMateri.data?.data.data.map((item) => (
                                            {
                                                meaning: item.name,
                                                value: item.id
                                            }
                                        ))}
                                        name="groupingMateri"
                                        label="Grouping Materi"
                                        required
                                        value={filterMateri}
                                    />
                                </div>

                                <div className="flex flex-col items-center md:items-start w-full">
                                    <div className="flex flex-row">
                                        <DonutChart data={detail?.data.materialChart.map(item => (
                                            {
                                                value: Number(item.value),
                                                label: item.label
                                            }
                                        )) ?? []} size={isMd ? 120 : 180} strokeWidth={isMd ? 18 : 24}/>
                                        <div className="flex flex-col flex-1 mt-5 mx-5">
                                            <Legend data={detail?.data.materialChart.map(item => (
                                                    {
                                                        value: Number(item.value),
                                                        label: item.label
                                                    }
                                                )) ?? []}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="md:flex items-center pt-2 justify-between">
                                            <p className="text-[14px] font-semibold">Materi Terakhir yang Kamu Akses</p>
                                        </div>
                                        <div className="w-full flex flex-row justify-between items-center border border-black/20 rounded-lg mt-2 p-3 bg-blue-300/30 shadow-sm">
                                            <div className="flex flex-row items-center gap-2">
                                                <File /> {detail?.data.latestMaterial}
                                            </div>
                                            {isMd ? (
                                                <ChevronRight
                                                    className="w-7 h-7 mt-1"
                                                    onClick={() => navigate(`/admin/material/${detail?.data.latestMaterial}`)}
                                                />
                                            ) : (
                                                <Button
                                                    className="p-2"
                                                    onClick={() => navigate(`/admin/material/${detail?.data.latestMaterial}`)}
                                                >
                                                    Lanjutkan Pembelajaran
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Latest Topic */}
                            <div className="relative border border-solid rounded-lg p-3 bg-white shadow-md m-3">
                                <p className="text-[20px] font-semibold">Topik</p>
                                <hr className="my-2 border-gray-300" />
                                <div className="mb-2">
                                    <InputSelect
                                        onChange={(value) => {
                                            setFilterTopik(value?.value ?? "");
                                        }}
                                        handleSearch={setSearchTopik}
                                        options={optionDashboardTopik.data?.data.data.map((item) => (
                                            {
                                                meaning: item.name,
                                                value: item.id
                                            }
                                        ))}
                                        name="groupingTopik"
                                        label="Grouping Topik"
                                        required
                                        value={filterTopik}
                                    />
                                </div>

                                <div className="flex flex-col items-center md:items-start w-full">
                                    <div className="flex flex-row">
                                        <DonutChart data={detail?.data.topicChart.map(item => (
                                            {
                                                value: Number(item.value),
                                                label: item.label
                                            }
                                        )) ?? []} size={isMd ? 120 : 180} strokeWidth={isMd ? 18 : 24}/>
                                        <div className="flex flex-col flex-1 mt-5 mx-5">
                                            <Legend data={detail?.data.topicChart.map(item => (
                                                    {
                                                        value: Number(item.value),
                                                        label: item.label
                                                    }
                                                )) ?? []}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="md:flex items-center pt-2 justify-between">
                                            <p className="text-[14px] font-semibold">Topik Terakhir yang Kamu Akses</p>
                                        </div>
                                        <div className="w-full flex flex-row justify-between border border-black/20 rounded-lg mt-2 p-3 bg-blue-300/30 shadow-sm">
                                            <div className="flex flex-row items-center gap-2">
                                                <File /> {detail?.data.latestTopic}
                                            </div>
                                            {isMd ? (
                                                <ChevronRight
                                                    className="w-7 h-7 mt-1"
                                                    onClick={() => navigate(`/admin/topic/${detail?.data.latestTopic}`)}
                                                />
                                            ) : (
                                                <Button
                                                    className="p-2"
                                                    onClick={() => navigate(`/admin/topic/${detail?.data.latestTopic}`)}
                                                >
                                                    Lanjutkan Pembelajaran
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Latest Quiz */}
                            <div className="relative border border-solid rounded-lg p-3 bg-white shadow-md m-3 mb-5">
                                <p className="text-[20px] font-semibold">Kuis</p>
                                <hr className="my-2 border-gray-300" />
                                <div className="mb-2">
                                    <InputSelect
                                        onChange={(value) => {
                                            setFilterKuis(value?.value ?? "");
                                        }}
                                        handleSearch={setSearchKuis}
                                        options={optionDashboardKuis.data?.data.data.map((item) => (
                                            {
                                                meaning: item.name,
                                                value: item.id
                                            }
                                        ))}
                                        name="groupingKuis"
                                        label="Grouping Kuis"
                                        required
                                        value={filterKuis}
                                    />
                                </div>

                                <div className="flex flex-col items-center md:items-start w-full">
                                    <div className="flex flex-row">
                                    <DonutChart data={detail?.data.quizChart.map(item => (
                                        {
                                            value: Number(item.value),
                                            label: item.label
                                        }
                                    )) ?? []} size={isMd ? 120 : 180} strokeWidth={isMd ? 18 : 24}/>
                                    <div className="flex flex-col flex-1 mt-5 mx-5">
                                        <Legend data={detail?.data.quizChart.map(item => (
                                                {
                                                    value: Number(item.value),
                                                    label: item.label
                                                }
                                            )) ?? []}
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <div className="md:flex items-center pt-2 justify-between">
                                        <p className="text-[14px] font-semibold">Kuis Terakhir yang Kamu Kerjakan</p>
                                    </div>
                                    <div className="w-full flex flex-row justify-between border border-black/20 rounded-lg mt-2 p-3 bg-blue-300/30 shadow-sm">
                                        <div className="flex flex-row items-center gap-2">
                                            <File /> {detail?.data.latestQuiz}
                                        </div>
                                        {isMd ? (
                                                <ChevronRight
                                                    className="w-7 h-7 mt-1"
                                                    onClick={() => navigate(`/admin/quiz/${detail?.data.latestQuiz}`)}
                                                />
                                            ) : (
                                                <Button
                                                    className="p-2"
                                                    onClick={() => navigate(`/admin/quiz/${detail?.data.latestQuiz}`)}
                                                >
                                                    Lanjutkan Pembelajaran
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {/* User  */}
                    <div className="col-span-1 mt-2 p-3 h-fit">
                        <div
                            onClick={() => setIsOpenStd(!isOpenStd)}
                            className="flex justify-between items-center cursor-pointer p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                        >
                            <div className="flex flex-row items-center gap-2">
                                <Users />
                                <h2 className="text-xl font-semibold">Jumlah Pengguna</h2>
                            </div>
                            <ChevronDown
                                className={`transition-transform duration-300 ${
                                isOpenStd ? "rotate-180" : ""
                                }`}
                            />
                        </div>
                        <div
                                ref={contentRefStd}
                                className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-md mb-4 -mt-1 px-3 rounded-b-lg"
                                style={{ maxHeight: maxHeightStd }}
                            >
                                <div className="flex flex-row items-center justify-between mt-1 ml-1">
                                    <p className="text-[18px] font-semibold">Total Pengguna</p>
                                    <p className="text-[18px] font-semibold mr-3">{detail?.data.userData.totalUser}</p>
                                </div>
                                <div className="flex flex-col mt-1 border border-solid p-3 rounded-md shadow-md">
                                    <p className="text-[17px] font-semibold">Siswa</p>
                                    <div className="mb-2">
                                            <InputSelect
                                                onChange={(value) => {
                                                    setFilterSiswa(value?.value ?? "");
                                                }}
                                                handleSearch={setSearchSiswa}
                                                options={optionDashboardSiswa.data?.data.data.map((item) => (
                                                    {
                                                        meaning: item.name,
                                                        value: item.id
                                                    }
                                                ))}
                                                name="groupingSiswa"
                                                label="Grouping Siswa"
                                                required
                                                value={filterSiswa}
                                            />
                                    </div>
                                    <SideBarChart data={detail?.data.userData.student.map((item) => (
                                        {
                                            label: item.label,
                                            value: Number(item.value)
                                        }
                                    )) ?? [
                                        {label: "Test", value: 10},
                                        {label: "Percobaan", value: 100},
                                        {label: "Percobaan apa ini", value: 120}
                                    ]}
                                    width={parentWidth - 80}
                                    />
                                </div>

                                <div className="flex flex-col my-3 border border-solid p-3 rounded-md shadow-md">
                                    <p className="text-[17px] font-semibold">Guru</p>
                                    <SideBarChart data={detail?.data.userData.teacher.map((item) => (
                                        {
                                            label: item.label,
                                            value: Number(item.value)
                                        }
                                    )) ?? [
                                        {label: "Test", value: 10},
                                        {label: "Percobaan", value: 100},
                                        {label: "Percobaan apa ini", value: 120}
                                    ]}
                                    width={parentWidth - 80}
                                    />
                                </div>
                        </div>
                    </div>

                    {/* To Do */}
                    <div className="col-span-1 mt-2 p-3 h-fit">
                        <div className="relative border-solid rounded-lg p-3 bg-white mt-2 mx-3 h-fit shadow-md">
                            <div className="flex flex-row items-center gap-2 mb-2">
                                <NotebookPen/>
                                <p className="text-[20px] font-semibold">To Do List</p>
                            </div>
                            <TodoList/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}