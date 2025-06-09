/* eslint-disable react-hooks/exhaustive-deps */
import { PaginationState } from "@tanstack/react-table";
import { ArrowLeft, ChevronRight, NotebookPen, School, Search, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePostSetAccess, { AccessReq } from "../../../api/Access/usePostSetAccess";
import useGetQuizListUser from "../../../api/Quiz/useGetQuizListUser";
import usePostAccessQuiz, { UserQuizAccessReq } from "../../../api/Quiz/usePostAccessQuiz";
import useGetLOV from "../../../api/useGetLOV";
import { Badge } from "../../../component/Badge";
import { Button } from "../../../component/Button/button";
import { Input } from "../../../component/InputField/input";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { Paginations } from "../../../component/Pagination";
import { ProgressBar } from "../../../component/Progress";
import { GradeText } from "../../../component/helper";
import { useMediaQuery } from "../../../component/useMediaQuery";

export const QuizPerMaterial = () => {
    const [searchMaterial, setSearchMaterial] = useState<string | undefined>(
        undefined
    );
    const [search, setSearch] = useState<string>("");
    const [filterGrade, setFilterGrade] = useState("");
    const [filterDiff, setFilterDiff] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const navigate = useNavigate();
    const { materialName } = useParams();
    const decodedTitle = decodeURIComponent(materialName || "");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const { data: quizList } = useGetQuizListUser(
        pagination.pageIndex,
        pagination.pageSize,
        localStorage.getItem("user") ?? "",
        decodedTitle,
        filterDiff,
        filterGrade,
        search
    );
    const accessQuiz = usePostSetAccess();
    const userAccessQuiz = usePostAccessQuiz();

    const itemsPerPage = 5;
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMaterials = quizList?.data.content.slice(startIndex, endIndex);

    const [searchGrade, setSearchGrade] = useState<string>("");
    const optionFilterGrade = useGetLOV();

    useEffect(() => {
        optionFilterGrade.mutate({
            type: "gradelov",
            search: searchGrade,
        });
    }, [searchGrade]);

    const [searchDiff, setSearchDiff] = useState<string>("");
    const optionFilterDiff = useGetLOV();

    useEffect(() => {
        optionFilterDiff.mutate({
            type: "levellov",
            search: searchDiff,
        });
    }, [searchDiff]);

    const handleAccess = (quizName: string, quizId: string) => {
        const data: AccessReq = {
            userId: localStorage.getItem("user") ?? "",
            type: "quiz",
            itemName: quizName
        }

        const data2: UserQuizAccessReq = {
            itemOne: localStorage.getItem("user") ?? "",
            itemTwo: quizId
        }

        accessQuiz.mutate(data, {
            onSuccess: () => {
                console.log("Sukses latest material");
            }
        })

        userAccessQuiz.mutate(data2, {
            onSuccess: (data) => {
                console.log("sukses quiz attempt", data.data)
                navigate(`/quiz/${decodedTitle}/${quizName}`, {
                    state: {attempt: data.data}
                })
            }
        })
    }

    const isSm = useMediaQuery("(max-width: 640px)");
    const isXl = useMediaQuery("(min-width: 1280px)");

    return (
        <div className="relative overflow-y-hidden max-w-full">
            <div className="flex flex-row w-[88dvw] md:w-[93dvw] lg:w-[95dvw] xl:w-[97dvw] items-center justify-between bg-white/70 border-solid rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 mx-3">
                <div className="flex flex-col w-full mt-3 ml-3">
                    <div className="w-full flex flex-row items-center gap-2 mt-2">
                        <ArrowLeft
                            onClick={() => navigate(-1)}
                            className="cursor-pointer"
                        />
                        <p className="text-[20px] font-semibold -mt-0.5">
                            Kuis {decodedTitle}
                        </p>
                    </div>
                    <hr className="w-full my-2 border-gray-300" />

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
                                //   setPagination({
                                //     pageIndex: 0,
                                //     pageSize: 10,
                                //   });
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
                                options={optionFilterGrade.data?.data.data.map((item) => ({
                                    meaning: item.id,
                                    value: item.name,
                                }))}
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
                                options={optionFilterDiff.data?.data.data.map((item) => ({
                                    meaning: item.name,
                                    value: item.id,
                                }))}
                                name="difficultyDiff"
                                label=" "
                                required={false}
                                value={filterDiff}
                                placeholder="Filter Difficulty"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        {paginatedMaterials?.map((item) => {
                            const badge =
                                item.difficulty.toLowerCase() === "novice"
                                    ? "success"
                                : item.difficulty.toLowerCase() === "expert"
                                    ? "danger"
                                    : "warning";
                            return (
                                <div className="relative flex flex-row justify-between items-center border-solid rounded-lg p-3 bg-white mt-5 mx-3 shadow-md">
                                    <div className="flex flex-col xl:flex-row max-w-full xl:w-full">
                                        <div className="w-full flex flex-row items-center mx-3 gap-2 my-1">
                                            <div className="flex flex-col md:flex-row gap-2 xl:w-full">
                                                <div className="flex flex-row gap-2 items-center">
                                                    <NotebookPen />
                                                    <p className="text-[17px] md:text-[20px] font-semibold -mt-1">
                                                        {item.quizName}
                                                    </p>
                                                </div>
                                                <div className="flex flex-row gap-5">
                                                    <Badge variant={badge} className="-mt-0.5">{item.difficulty}</Badge>
                                                    <div className="flex flex-row gap-2 items-center ml-2">
                                                        <School className="w-5 h-5"/>
                                                        <p className="text-[14px] font-semibold">{GradeText[item.grade as keyof typeof GradeText]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {isXl && (
                                                <div className="w-full mb-1">
                                                    {item.progress > 1 && (
                                                        <div className="w-full xl:max-w-md mt-2">
                                                            <ProgressBar value={item.progress} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {!isXl && (
                                            <div className="w-full mx-3 mb-1">
                                                {item.progress > 1 && (
                                                    <div className="w-[50%] mt-2">
                                                        <ProgressBar value={item.progress} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="w-[30%] md:w-[50%] xl:w-[20%] gap-3 flex mx-3 my-1">
                                            <Badge className="text-[12px] md:text-[14px]" variant={item.latestScore < 75 ? "warning" : item.latestScore < 40 ? "danger" : "success"}>
                                                skor terakhir: {item.latestScore}
                                            </Badge>
                                            <Badge className="text-[12px] md:text-[14px]" variant={item.averageScore < 75 ? "warning" : item.averageScore < 40 ? "danger" : "success"}>
                                                rata - rata: {item.averageScore}
                                            </Badge>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        className="w-8 h-8 mr-3 cursor-pointer"
                                        onClick={() => handleAccess(item.quizName, item.quizId)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <Paginations
                        data={{
                        pageIndex: pageIndex,
                        totalPages: quizList?.data.totalPages ?? 1,
                        }}
                        setPageIndex={setPageIndex}
                    />
                </div>
            </div>
        </div>
    );
};
