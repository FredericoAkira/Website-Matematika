import { ChartColumnIncreasingIcon, ChevronDown, ChevronRight, File, FileEditIcon, NotebookPen, PlusIcon, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostAccessDaily from "../../api/Access/usePostAccessDaily";
import { useAuthStore } from "../../api/auth";
import useGetDailyTask from "../../api/Dashboard/Recommendation/useGetDailyTask";
import useGetRecommendation from "../../api/Dashboard/Recommendation/useGetRecommendation";
import useGetDetail from "../../api/Dashboard/useGetDetail";
import useGetUserProfile from "../../api/Dashboard/useGetUserProfile";
import usePostAccessQuiz, { UserQuizAccessReq } from "../../api/Quiz/usePostAccessQuiz";
import useGetLOV from "../../api/useGetLOV";
import { Badge } from "../../component/Badge";
import { Button } from "../../component/Button/button";
import RecommendedCarousel from "../../component/Carousel";
import DonutChart from "../../component/Chart/donutChart";
import Legend from "../../component/Chart/legend";
import { InputSelect } from "../../component/InputSelect/InputSelect";
import { ProgressBar } from "../../component/Progress";
import StreakFlame from "../../component/Streak";
import TimeUntilMidnight from "../../component/Timer";
import TodoList from "../../component/ToDo";
import { useMediaQuery } from "../../component/useMediaQuery";
import { UserRoleEnum } from "../../component/userRole";
import { AddStudent } from "./ManageStudent/AddStudent";

export const HomePage = () => {
    const payload = localStorage.getItem("user") ?? "";
    const auth = useAuthStore((state) => state.role) ?? undefined;
    const navigate = useNavigate();
    const { data: userData } = useGetUserProfile(payload);
    const {data: daily} = useGetDailyTask(payload, userData?.data.grade ?? "", userData?.data.level ?? "");
    const {data: recom} = useGetRecommendation(payload);
    const userAccessQuiz = usePostAccessQuiz();
    const accessDaily = usePostAccessDaily();
    const [isOpen, setIsOpen] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState("0px");
    const [isOpenStd, setIsOpenStd] = useState(true);
    const contentRefStd = useRef<HTMLDivElement>(null);
    const [maxHeightStd, setMaxHeightStd] = useState("0px");
    // const [isDaily, setIsDaily] = useState(false);
    
    const [materialFilter, setMaterialFilter] = useState<string>("name");
    const [searchMateri, setSearchMateri] = useState<string>("");
    const optionDashboardMateri = useGetLOV();
    
    const [quizFilter, setQuizFilter] = useState<string>("name");
    const [searchKuis, setSearchKuis] = useState<string>("");
    const optionDashboardKuis = useGetLOV();
    
    const {data} = useGetDetail(payload, quizFilter, materialFilter);
    const isMd = useMediaQuery("(max-width: 768px)");
    
    useEffect(() => {
        optionDashboardMateri.mutate({
            type: "filterlov",
            search: searchMateri
        })
    }, [searchMateri]);

    useEffect(() => {
        optionDashboardKuis.mutate({
            type: "filterlov",
            search: searchKuis
        })
    }, [searchKuis]);

    useEffect(() => {
        if (contentRef.current) {
        setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpenStd && contentRefStd.current) {
            const timer = requestAnimationFrame(() => {
                setMaxHeightStd(`${contentRefStd?.current?.scrollHeight}px`);
            });
            return () => cancelAnimationFrame(timer);

        } else if(!isOpenStd){
            setMaxHeightStd("0px");
        }
    }, [data?.data.studentList, isOpenStd]);

    const handleAccess = (quizId: string) => {
        const data: UserQuizAccessReq = {
            itemOne: payload,
            itemTwo: quizId
        }

        accessDaily.mutate(payload.replace(/:+$/, ''));

        userAccessQuiz.mutate(data, {
            onSuccess: (data) => {
                navigate(`/dailyChallenge`, {
                        state: {attempt: data.data, datas: daily?.data}
                })
            }
        })
    }

    const badge = data?.data.latestQuiz.difficulty.toLowerCase() === "novice" ? "success" : data?.data.latestQuiz.difficulty.toLowerCase() === "expert" ? "danger" : "warning";

    return (
        <div className="relative overflow-y-hidden">
            {/* Latihan Harian */}
            <div className="flex flex-row items-center justify-between border-solid rounded-lg p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] mx-3 translate-y-3">
                <div className="w-full flex flex-row items-center m-3 gap-2">
                    <div>
                        <StreakFlame count={userData?.data.streak ?? 0} size={50}/>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between">
                            <p className="text-[17px] md:text-[24px] font-semibold ml-5">Tantangan Harian</p>
                            <div className="ml-5 md:ml-0 translate-y-1">
                                {data?.data.doDaily
                                    ?<Badge variant={"success"}>Selesai</Badge>
                                    :<Badge variant={"danger"}><TimeUntilMidnight/></Badge>
                                }
                            </div>
                        </div>
                        {/* <div className="flex flex-row items-center gap-5 ml-5">
                            <span className="flex flex-row items-center gap-2"> <Sword/> {profileData.daily.difficulty} </span>
                            <span className="flex flex-row items-center gap-2"> <Trophy/> {profileData.daily.expPoint}XP </span>
                        </div> */}
                    </div>
                </div>
                <ChevronRight className="w-8 h-8 mr-3 cursor-pointer" onClick={() => handleAccess("daily")}/>
            </div>

            {/* Rekomendasi */}
            <div className="relative border-solid rounded-lg p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] mt-5 mx-3 translate-y-3">
                <p className="text-[20px] font-semibold mb-2">Rekomendasi Materi untuk Kamu</p>
                <RecommendedCarousel materials={recom?.map((item,index) => (
                    {
                        id: String(index + 1),
                        title: item.title,
                        description: item.description,
                        imageUrl: item.background ?? "/Image/image.png"
                    }
                )) ?? []} />
            </div>

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
                            <h2 className="text-xl font-semibold">Progress Kamu</h2>
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
                        style={{ maxHeight: maxHeight }}
                    >
                        <div className="flex flex-col gap-4 my-4 w-full">
                            {/* Latest Material */}
                            <div className="relative border border-solid rounded-lg p-3 bg-white shadow-md m-3">
                                <p className="text-[20px] font-semibold">Materi</p>
                                <hr className="my-2 border-gray-300" />
                                <div className="mb-2">
                                    <InputSelect
                                        onChange={(value) => {
                                            setMaterialFilter(value?.value ?? "");
                                        }}
                                        handleSearch={setSearchMateri}
                                        options={[
                                            { meaning: "All Materials", value: "name" },
                                            ...(optionDashboardMateri.data?.data.data || []).map(item => ({
                                                meaning: item.name,
                                                value: item.id
                                            }))
                                        ]}
                                        name="groupingMateri"
                                        label="Grouping Materi"
                                        required
                                        value={materialFilter}
                                    />
                                </div>

                                <div className="flex flex-col items-center md:items-start w-full">
                                    {/* Donut + Legend row */}
                                    <div className="flex flex-row">
                                        <DonutChart
                                        data={data?.data.materialChart.map(item => ({
                                            label: item.label,
                                            value: Number(item.value)
                                        })) ?? []}
                                        size={isMd ? 120 : 180}
                                        strokeWidth={isMd ? 18 : 24}
                                        />
                                        <div className="flex flex-col flex-1 mt-5 mx-5">
                                        <Legend
                                            data={data?.data.materialChart.map(item => ({
                                            label: item.label,
                                            value: Number(item.value)
                                            })) ?? []}
                                        />
                                        </div>
                                    </div>

                                    {/* "Materi Terakhir" section */}
                                    <div className="w-full">
                                        <div className="md:flex items-center pt-2 justify-between">
                                            <p className="text-[14px] font-semibold">Materi Terakhir yang Kamu Akses</p>
                                        </div>
                                        <div className="w-full flex flex-row justify-between items-center border border-black/20 rounded-lg mt-2 p-3 shadow-sm bg-blue-300/30">
                                            <div className="flex flex-col md:flex-row items-center gap-2">
                                                <div className="flex flex-row items-center gap-2">
                                                    <File />
                                                    <p>{data?.data.latestMaterial?.materialName}</p>
                                                </div>
                                                <div className="flex flex-row items-center gap-2 md:ml-0">
                                                    <Badge variant={"default"}>Kelas: {data?.data.latestMaterial.grade}</Badge>
                                                    <Badge variant={badge}>{data?.data.latestMaterial.difficulty}</Badge>
                                                </div>
                                            </div>
                                            {isMd ? (
                                                <ChevronRight
                                                    className="w-7 h-7 mt-1"
                                                    onClick={() => navigate(`../learn/${data?.data.latestMaterial.materialName}`)}
                                                />
                                            ) : (
                                                <Button
                                                    className="p-2"
                                                    onClick={() => navigate(`../learn/${data?.data.latestMaterial.materialName}`)}
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
                                        setQuizFilter(value?.value ?? "");
                                    }}
                                    handleSearch={setSearchKuis}
                                    options={[
                                        {meaning: "All Quizzes", value: "name"},
                                        ...(optionDashboardKuis.data?.data.data || []).map((item) => ({
                                            meaning: item.name,
                                            value: item.id
                                        }))
                                    ]}
                                    name="groupingKuis"
                                    label="Grouping Kuis"
                                    required
                                    value={quizFilter}
                                />
                                </div>

                                <div className="flex flex-col items-center md:items-start w-full">
                                    <div className="flex flex-row">
                                        <DonutChart data={data?.data.quizChart.map(item => (
                                            {
                                                label: item.label,
                                                value: Number(item.value)
                                            }
                                        )) ?? []} size={isMd ? 120 : 180} strokeWidth={isMd ? 18 : 24}/>
                                        <div className="flex flex-col flex-1 mt-5 mx-5">
                                            <Legend data={data?.data.quizChart.map(item => (
                                                {
                                                    label: item.label,
                                                    value: Number(item.value)
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
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex flex-row items-center gap-2">
                                                    <FileEditIcon/> {data?.data.latestQuiz?.quizName}
                                                    <div className="flex flex-row items-center gap-2">
                                                        <Badge variant={"default"}>Kelas: {data?.data.latestQuiz.grade}</Badge>
                                                        <Badge variant={badge}>{data?.data.latestQuiz.difficulty}</Badge>
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <ProgressBar value={(data?.data.latestQuiz?.progress ?? 0) * 100}/>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {isMd ? (
                                                    <ChevronRight
                                                        className="w-7 h-7 mt-1"
                                                        onClick={() => navigate(`../quiz/${data?.data.latestQuiz.materialName}/${data?.data.latestQuiz.quizName}`)}
                                                    />
                                                ) : (
                                                    <Button className="p-2" onClick={() => navigate(`../quiz/${data?.data.latestQuiz.materialName}/${data?.data.latestQuiz.quizName}`)}>Lanjutkan Kuis </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {/* Student */}
                    {auth === UserRoleEnum.Teacher && (
                        <div className="col-span-1 mt-2 p-3 h-fit">
                            <div
                                onClick={() => setIsOpenStd(!isOpenStd)}
                                className="flex justify-between items-center cursor-pointer p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                            >
                                <div className="flex flex-row items-center gap-2">
                                    <Users />
                                    <h2 className="text-xl font-semibold">Murid Anda</h2>
                                </div>
                                <ChevronDown
                                    className={`transition-transform duration-300 ${
                                    isOpenStd ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                            <div
                                ref={contentRefStd}
                                className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-md mb-2 -mt-1 px-3 rounded-b-lg"
                                style={{ maxHeight: maxHeightStd }}
                            >
                                <div className="flex flex-row items-center justify-between mt-1 ml-1">
                                    <p className="text-[18px] font-semibold">Total Murid Anda</p>
                                    <p className="text-[18px] font-semibold mr-3">{data?.data.studentList.length}</p>
                                </div>
                                <div className="flex justify-end my-2">
                                    <Button
                                        trailingIcon={PlusIcon}
                                        variant={"default"}
                                        className="p-2 text-[12px]"
                                        onClick={() => setIsAdding(true)}
                                    >
                                        Tambahkan
                                    </Button>
                                </div>
                                {data?.data.studentList.map(item => (
                                    <div className="flex flex-col mt-1 border border-solid p-3 rounded-md shadow-md mb-3">
                                        <p className="text-[17px] font-semibold">{item.studentName}</p>
                                        <p className="text-[17px] font-semibold">{item.grade}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* To Do */}
                    <div className="col-span-1 p-3 h-fit">
                        <div className="relative border-solid rounded-lg p-3 bg-white h-fit shadow-md">
                            <div className="flex flex-row items-center gap-2 mb-2">
                                <NotebookPen/>
                                <p className="text-[20px] font-semibold">To Do List</p>
                            </div>
                            <TodoList/>
                        </div>
                    </div>

                    <AddStudent
                        open={isAdding}
                        setOpen={setIsAdding}
                        availStudent={data?.data.studentList.map(item => item.studentName)}
                    />
                </div>
            </div>
        </div>
    )
}