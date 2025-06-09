import { ArrowLeft, ChartLine, ChevronDown, File, MedalIcon, Pen, SchoolIcon, Sword } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetStudentDetail from "../../../api/Student/useGetStudentDetail";

export const StudentDetailPage = () => {
    const { studentId } = useParams();
    const {data: detailStudent} = useGetStudentDetail(studentId ?? "");
    const navigate = useNavigate();
    const [isMaterialOpen, setIsMaterialOpen] = useState(true);
    const materialContentRef = useRef<HTMLDivElement>(null);
    const [maxMaterialHeight, setMaxMaterialHeight] = useState("0px");
    const [isQuizOpen, setIsQuizOpen] = useState(true);
    const quizContentRef = useRef<HTMLDivElement>(null);
    const [maxQuizHeight, setMaxQuizHeight] = useState("0px");
    
    useEffect(() => {
        if (isMaterialOpen && materialContentRef.current) {
          const timer = requestAnimationFrame(() => {
            setMaxMaterialHeight(`${materialContentRef?.current?.scrollHeight}px`);
          });
          return () => cancelAnimationFrame(timer);
        } else if(!isMaterialOpen){
            setMaxMaterialHeight(`0px`);
        }
      }, [detailStudent?.data.accessedMaterials, isMaterialOpen]);

    useEffect(() => {
        if (isQuizOpen && quizContentRef.current) {
            const timer = requestAnimationFrame(() => {
                setMaxQuizHeight(`${quizContentRef?.current?.scrollHeight}px`);
            });
            return () => cancelAnimationFrame(timer);

        } else if(!isQuizOpen){
            setMaxQuizHeight("0px");
        }
    }, [detailStudent?.data.accessedMaterials, isQuizOpen]);


    return (
        <div className="relative overflow-y-hidden">
            <div className="flex flex-col items-center overflow-y-auto hide-scrollbar bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 mx-3 h-[calc(100vh-20px)]">
                <div className="w-full mt-5 mx-5">
                    <div className="flex flex-row items-center gap-3">
                        <ArrowLeft
                            onClick={() => navigate(-1)}
                            className="cursor-pointer"
                        />
                        <p className="text-[18px] font-bold">{detailStudent?.data.studentName}</p>
                    </div>
                    <hr className="w-full my-2 border-gray-300" />
                </div>

                <div className="mt-5 mx-3 w-full">
                    <div
                        onClick={() => setIsMaterialOpen(!isMaterialOpen)}
                        className="flex justify-between items-center cursor-pointer p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <File />
                            <h2 className="text-xl font-semibold">Materi yang diakses</h2>
                        </div>
                        <ChevronDown
                            className={`transition-transform duration-300 ${
                            isMaterialOpen ? "rotate-180" : ""
                            }`}
                        />
                    </div>
                    {/* Latest Material */}
                    <div
                        ref={materialContentRef}
                        className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-md mb-4 -mt-2 overflow-y-auto hide-scrollbar"
                        style={{ maxHeight: maxMaterialHeight }}
                    >
                        <div className="flex flex-col gap-4 my-4 w-full">
                            {detailStudent?.data.accessedMaterials.map((item) => (
                                <div className="relative border border-solid rounded-lg p-3 bg-white shadow-md m-3">
                                    <p className="text-[20px] font-semibold">{item.materialName}</p>
                                    <hr className="my-2 border-gray-300" />
                                    <div className="flex flex-row items-center gap-5 mb-3">
                                        <span className="flex flex-row items-center gap-2"> <SchoolIcon/> Grade: {item.grade} </span>
                                        <span className="flex flex-row items-center gap-2"> <Sword/> Difficulty: {item.difficulty} </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="my-5 mx-3 w-full">
                    <div
                        onClick={() => setIsQuizOpen(!isQuizOpen)}
                        className="flex justify-between items-center cursor-pointer p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <Pen />
                            <h2 className="text-xl font-semibold">Kuis yang diakses</h2>
                        </div>
                        <ChevronDown
                            className={`transition-transform duration-300 ${
                            isQuizOpen ? "rotate-180" : ""
                            }`}
                        />
                    </div>
                    {/* Latest Quiz */}
                    <div
                        ref={quizContentRef}
                        className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-md mb-4 -mt-2 max-h-[100vh] overflow-y-auto hide-scrollbar"
                        style={{ maxHeight: maxQuizHeight }}
                    >
                        <div className="flex flex-col gap-4 my-4 w-full">
                            {detailStudent?.data.accessedQuizzes.map((item) => (
                                <div className="relative border border-solid rounded-lg p-3 bg-white shadow-md m-3">
                                    <p className="text-[20px] font-semibold">{item.quizName}</p>
                                    <hr className="my-2 border-gray-300" />
                                    <div className="flex flex-row items-center gap-5 mb-3">
                                        <div className="md:flex md:items-center md:justify-center md:gap-5">
                                            <span className="flex flex-row items-center gap-2"> <SchoolIcon/> Kelas: {item.grade} </span>
                                            <span className="flex flex-row items-center gap-2 mt-2 md:mt-0"> <Sword/> Kesulitan: {item.difficulty} </span>
                                        </div>
                                        <div className="md:flex md:items-center md:justify-center md:gap-5">
                                            <span className="flex flex-row items-center gap-2"> <MedalIcon/> Skor terakhir: {item.latestScore} </span>
                                            <span className="flex flex-row items-center gap-2 mt-2 md:mt-0"> <ChartLine/> Skor rata - rata: {item.averageScore} </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}