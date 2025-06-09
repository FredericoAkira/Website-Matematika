/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Latex from "react-latex-next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGetQuestions from "../../../api/Quiz/useGetQuestions";
import useGetQuizDetailUser from "../../../api/Quiz/useGetQuizDetailUser";
import useGetSolution from "../../../api/Quiz/useGetSolution";
import usePostAnswerQuestion, { SubmitAccessReq } from "../../../api/Quiz/usePostAnswerQuestion";
import usePostFinalResult, { ResultDetail } from "../../../api/Quiz/usePostFinalResult";
import { Button } from "../../../component/Button/button";
import { CorrectDialog } from "../../../component/Dialog/CorrectDialog";
import { FalseDialog } from "../../../component/Dialog/FalseDialog";
import { QuizResultDialog } from "../../../component/Dialog/QuizResultDialog";
import { Input } from "../../../component/InputField/input";
import { Label } from "../../../component/Label";

type checkResponse = {
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
}

type paramCheckResponse = {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
}

type solutionData = {
    explanation: string;
    text: string;
    image: string;
    video: string;
    audio: string;
}

type QuizDetail = {
    questionId: string;
    question: string;
    image: string;
    options: string[] | null;
}


// interface IQuizDetail {
//     datas?: QuizDetail[]
// }

export const QuizPage = () => {
    // backbutton
    const navigate = useNavigate();
    // pagination
    const [index, setIndex] = useState(0)
    // solution popup
    const [openTrue, setOpenTrue] = useState(false);
    const [openFalse, setOpenFalse] = useState(false);

    // api hitting payload
    const { quizName } = useParams();
    const decodedTitle = decodeURIComponent(quizName || "");
    const location = useLocation();
    const { attempt, datas } = location.state || {};
    // store answer when no option
    const [inputAnswer, setInputAnswer] = useState<string>("");

    // getting list of question
    const {data: details} = useGetQuestions(attempt, decodedTitle);
    const [questions, setQuestions] = useState<QuizDetail[]>([]);

    // posting the answer when submit
    const answerQuestion = usePostAnswerQuestion();

    // getting previous answered details
    const {data: quizAnswered} = useGetQuizDetailUser(
        localStorage.getItem("user") ?? "",
        decodedTitle.length > 0 ? decodedTitle : "daily"
    )

    const solutionData = useGetSolution();

    // result for when submitting
    const [result, setResult] = useState<(checkResponse | undefined)[]>([])
    const getFinalResult = usePostFinalResult();

    // result from get previous
    const [dataResult, setDataResult] = useState<paramCheckResponse[]>([]);
    const resultForIndex = dataResult?.find(item => item.questionId === questions?.[index]?.questionId)

    const [openFinal, setOpenFinal] = useState(false);
    const [dataFinal, setDataFinal] = useState<ResultDetail>();

    const [dataSolution, setDataSolution] = useState<solutionData>(
        {
            explanation: "",
            text: "",
            image: "",
            video: "",
            audio: ""
        }
    );

    useEffect(() => {
        if(datas){
            setQuestions(datas);
        } else{
            setQuestions(details?.data.data ?? []);
        }
    }, [details?.data.data, datas]);

    // console.log(datas);

    useEffect(() => {
        if(quizAnswered){
            setDataResult(quizAnswered.data);
        }
    },[quizAnswered])

    useEffect(() => {
        if(resultForIndex?.userAnswer){
            solutionData.mutate(resultForIndex.questionId, {
                onSuccess:(data) => {
                    setDataSolution({
                        ...data.data,
                        audio: ""
                    });
                }
            })
        }
    },[resultForIndex?.userAnswer])

    const submitAnswer = (answer: string) => {
        const data:SubmitAccessReq = {
            attemptId: attempt,
            questionId: questions?.[index].questionId ?? "",
            userAnswer: answer
        }

        answerQuestion.mutate(data, {
            onSuccess: (data) => {
                setResult(prev => {
                    const updated = [...prev];
                    updated[index] = data.data; // set result for current index
                    return updated;
                });
                if(data){
                    solutionData.mutate(questions?.[index].questionId, {
                        onSuccess:(data) => {
                            setDataSolution({
                                ...data.data,
                                audio: ""
                            });
                        }
                    })
                    if(data.data.isCorrect){
                        setOpenTrue(true);
                    }else{
                        setOpenFalse(true);
                    }
                }
            }
        })
    }

    useEffect(() => {
        if(questions.length > 0){
            if(result.filter(item => item !== undefined).length === questions.length && !openFalse && !openTrue){
                getFinalResult.mutate(attempt, {
                    onSuccess: (data) => {
                        setDataFinal(data.data)
                        setOpenFinal(true)
                    }
                })
            }
        }
    },[result, questions, openFalse, openTrue])

    useEffect(() => {
        if(dataFinal && !openFinal){
            localStorage.setItem("shouldRefetchSidebar", "true");
            navigate(-1)
        }
    }, [dataFinal, openFinal])

    return(
        <div className="relative overflow-y-hidden">
            <div
                className="flex flex-col items-center justify-between bg-white/70 border-solid rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 mx-3"
            >
                {/* header */}
                <div className="flex flex-col w-full mt-3 ml-3">
                    <div className="w-full flex flex-row items-center gap-2 mt-2">
                        <ArrowLeft
                        onClick={() => navigate(-1)}
                        className="cursor-pointer"
                        />
                        <p className="text-[18px] md:text-[20px] font-semibold -mt-0.5">{decodedTitle}</p>
                    </div>
                    <hr className="w-full my-2 border-gray-300" />
                </div>
                {/* Pertanyaan */}
                <div className="flex flex-col w-full p-3">
                    {/* Pertanyaan text */}
                    {(() => {
                        const question = questions?.[index]?.question ?? "";
                        const isPureLatex = question.trim().startsWith("$") && question.trim().endsWith("$");
                        const containsLatex = question.includes("$");

                        if (isPureLatex) {
                        return (
                            <div className="text-center text-3xl my-5">
                            <Latex>{question}</Latex>
                            </div>
                        );
                        } else if (containsLatex) {
                        // Split the text by LaTeX patterns
                        const parts = question.split(/(\$[^$]+\$)/g); // keeps the LaTeX chunks
                        return (
                            <p className="text-lg font-semibold">
                            {index + 1}.{" "}
                            {parts.map((part, idx) =>
                                part.startsWith("$") && part.endsWith("$") ? (
                                <Latex key={idx}>{part}</Latex>
                                ) : (
                                <span key={idx}>{part}</span>
                                )
                            )}
                            </p>
                        );
                        } else {
                        return (
                            <p className="text-lg font-semibold">
                            {index + 1}. {question}
                            </p>
                        );
                        }
                    })()}

                    {/* Image */}
                    {questions?.[index]?.image && (
                        <div className="flex flex-row w-full items-center justify-center border border-gray-400/50 rounded-lg p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)]">
                            <div className="text-center text-3xl my-5">
                            {/* {quizDetail?.content[index]?.textContent && (<Latex>{quizDetail?.content[index]?.textContent}</Latex>)} */}
                            </div>
                        </div>
                    )}
                </div>

                {/* Answer field */}
                <div className="w-full pr-5">
                    {questions?.[index]?.options && questions?.[index]?.options.length > 0 ? (
                        questions?.[index]?.options?.map((item, i) => {
                            const hasAnswered = result?.[index]?.userAnswer !== undefined || resultForIndex?.userAnswer !== undefined;
                            const isCorrect = result?.[index]?.isCorrect || resultForIndex?.isCorrect;
                            const isSelected = item === result?.[index]?.userAnswer || item === resultForIndex?.userAnswer;
                            const isCorrectAnswer = item === result?.[index]?.correctAnswer || item === resultForIndex?.correctAnswer;
                            
                            return (
                                <div
                                    key={i}
                                    className={`
                                        w-full flex justify-center items-center rounded-lg p-3 mt-2 mx-3 shadow-md
                                        ${hasAnswered ? "pointer-events-none" : "cursor-pointer"}
                                        ${
                                        isSelected
                                            ? isCorrect
                                            ? "bg-green-500 text-white border-[3px] border-green-800"
                                            : "bg-red-500 text-white border-[3px] border-red-800"
                                            : hasAnswered && isCorrectAnswer
                                            ? "bg-green-500 text-white border border-gray-300"
                                            : hasAnswered
                                            ? "opacity-50 border border-gray-300"
                                            : "bg-white border border-gray-300"
                                        }
                                    `}
                                    onClick={() => {
                                        submitAnswer(item)
                                    }}
                                >
                                    {item}
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col">
                            <Label>Answwer</Label>
                            <Input
                                id="quizName"
                                className="border border-gray-300 bg-white"
                                placeholder="Test"
                                onChange={(e) => {
                                    setInputAnswer(e.target.value)
                                }}
                            />
                            <Button className="mt-3 p-2" onClick={() => submitAnswer(inputAnswer)}>
                                Submit Answer
                            </Button>
                        </div>
                    )}
                </div>

                {/* pagination */}
                <div className="flex w-full justify-between my-5">
                    <Button variant={"outline"} onClick={() => setIndex(index-1)} disabled={index === 0}>Back</Button>
                        <p>{index+1}/{questions?.length}</p>
                    <Button onClick={() => setIndex(index+1)} disabled={questions && index === questions.length - 1}>Next</Button>
                </div>
            </div>

            {/* Solution */}
            {(() => {
                const selectedAnswer = result?.[index]?.userAnswer || resultForIndex?.userAnswer
                if (!selectedAnswer) return null;
                const isCorrect = result?.[index]?.isCorrect || resultForIndex?.isCorrect;

                return (
                    <div className="flex justify-end mt-5 pr-5">
                        <button
                            onClick={() => {
                                if (isCorrect) {
                                    setOpenTrue(true);
                                } else {
                                    setOpenFalse(true);
                                }
                            }}
                            className="bg-blue-500 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                        >
                            Lihat Penjelasan
                        </button>
                    </div>
                );
            })()}

            <CorrectDialog
                open={openTrue}
                setOpen={setOpenTrue}
                material={dataSolution}
                onClose={() => setIndex(index + 1)}
                isLast={questions ? index === questions?.length - 1 : true}
            />

            <FalseDialog
                open={openFalse}
                setOpen={setOpenFalse}
                material={dataSolution}
                onClose={() => setIndex(index + 1)}
                isLast={questions ? index === questions?.length - 1 : true}
            />

            <QuizResultDialog
                open={openFinal}
                setOpen={setOpenFinal}
                data={dataFinal}
                onClose={() => {
                    localStorage.setItem("shouldRefetchSidebar", "true");
                    navigate(-1)
                }}
            />
        </div>
    )
}