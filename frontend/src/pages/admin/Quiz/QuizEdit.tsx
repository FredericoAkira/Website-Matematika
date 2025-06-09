/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDown, ChevronRight, Trash2Icon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useGetQuizDetail from "../../../api/Quiz/useGetQuizDetail";
import usePostEditQuiz, { EditQuizRequest } from "../../../api/Quiz/usePostEditQuiz";
import usePostCheckTopic from "../../../api/Topic/usePostCheckTopic";
import useGetLOV from "../../../api/useGetLOV";
import { Button } from "../../../component/Button/button";
import { Dropzone } from "../../../component/Dropzone";
import { Input } from "../../../component/InputField/input";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { Label } from "../../../component/Label";

interface ITopicForm {
  onClose?: () => void;
  refetch?: () => void;
}

interface QuizSectionData {
  id: number;
  isOpen: boolean;
}

interface ContentData {
  id: number;
  questionId?: string;
  question?: string;
  imageFile?: File | null;
  imageUrl?: string | null;
  options?: string[];
  answer?: string;
  difficulty?: string;
  solution?: {
    explanation?: string;
    text?: string;
    imageUrl?: string | null;
    imageFile?: File | null;
    video?: string;
  };
}

type FileWithPreview = File & { preview?: string };

export const QuizEdit: React.FC<ITopicForm> = ({
  onClose,
}) => {
  const form = useForm();
  const navigate = useNavigate();
  const editQuiz = usePostEditQuiz();
  const [sections, setSections] = useState<QuizSectionData[]>([{ id: 1, isOpen: true }]);
  const [contentData, setContentData] = useState<ContentData[]>([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);
  const [newOption, setNewOption] = useState<Record<number, string[]>>({});
  const [initialFilesMap, setInitialFilesMap] = useState<Record<number, FileWithPreview[]>>({});
  const [initialSolutionMap, setInitialSolutionMap] = useState<Record<number, FileWithPreview[]>>({});
  const uploadFile = usePostCheckTopic();
  const { quizName } = useParams();
  const decodedTitle = decodeURIComponent(quizName || "");
  const { data: details } = useGetQuizDetail(decodedTitle);

  const [searchGrade, setSearchGrade] = useState<string>("");
  const optionGrade = useGetLOV();
    
  const [searchProf, setSearchProf] = useState<string>("");
  const optionProficiency = useGetLOV();
  
  useEffect(() => {
    optionGrade.mutate({
      type: "gradelov",
      search: searchGrade
    })
  }, [searchGrade]);
  
  useEffect(() => {
    optionProficiency.mutate({
      type: "levellov",
      search: searchProf
    })
  }, [searchProf]);

  useEffect(() => {
    const remote = details?.data.data.quizContent;
    if(remote && remote.length) {
        const mapped: ContentData[] = remote.map((item, idx) => {
            setNewOption((prev) => ({ ...prev, [idx]: item.options }));
          
            return {
              id: idx + 1,
              questionId: item.questionId,
              question: item.question,
              imageFile: null,
              imageUrl: item.image,
              options: item.options,
              answer: item.correctAnswer,
              difficulty: item.difficulty,
              solution: {
                ...item.solution,
                imageUrl: item.solution.image
              },
            };
          });
        form.setValue("quizName", details?.data.data.quizName);
        form.setValue("difficulty", details?.data.data.difficulty);
        form.setValue("grade", details?.data.data.grade);
        setContentData(mapped);
        setSections(mapped.map((_,idx) => ({id: idx + 1, isOpen: true})));
        setNextId(mapped.length + 1);
    }},[details?.data.data.difficulty, details?.data.data.grade, details?.data.data.quizContent, details?.data.data.quizName, form])

    async function urlToFile(url: string, filename?: string): Promise<File> {
        const res  = await fetch(url);
        const blob = await res.blob();
        // you can infer filename from URL if you want:
        const name = filename || url.split('/').pop() || 'file';
        return new File([blob], name, { type: blob.type });
    }

    useEffect(() => {
        contentData.forEach((c) => {
          if (c.imageUrl && !c.imageFile && !initialFilesMap[c.id]) {
            urlToFile(c.imageUrl)
              .then((file) => {
                const previewFile = Object.assign(file, {
                  preview: c.imageUrl ?? URL.createObjectURL(file),
                });
                setInitialFilesMap((prev) => ({ ...prev, [c.id]: [previewFile] }));
                setContentData((prev) =>
                  prev.map((item) =>
                    item.id === c.id ? { ...item, imageFile: file } : item
                  )
                );
              })
              .catch((err) => {
                console.error("Failed to preload file for section", c.id, err);
              });
          }
          
          if (c.solution?.imageUrl && !c.solution.imageFile && !initialSolutionMap[c.id]) {
            urlToFile(c.solution.imageUrl)
              .then((file) => {
                const previewFile = Object.assign(file, {
                  preview: c.solution?.imageUrl ?? URL.createObjectURL(file),
                });
                setInitialSolutionMap((prev) => ({ ...prev, [c.id]: [previewFile] }));
                setContentData((prev) =>
                    prev.map((item) => (item.id === c.id ? { ...item, solution: {
                      ...item.solution,
                      imageFile: file }} : item))
                );
              })
              .catch((err) => {
                console.error("Failed to preload file for section", c.id, err);
              });
          }
        });
      }, [contentData, initialSolutionMap, initialFilesMap]);
  
  const handleAddSection = () => {
    setSections((prev) => [...prev, { id: nextId, value: "", isOpen: true }]);
    setContentData((prev) => [...prev, { id: nextId }]);
    setNextId((prev) => prev + 1);
  };

  const toggleSection = (id: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const handleDeleteSection = (id: number) => {
    if (sections.length === 1) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    setContentData((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeleteOption = (id: number, index: number) => {
    setContentData((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedOptions = [...(c.options ?? [])];
          updatedOptions.splice(index, 1);
          return { ...c, options: updatedOptions };
        }
        return c;
      })
    );
  };

  const handleSave = async () => {
    const uploadedContent = await Promise.all(
      contentData.map(async (c) => {
        let imageUrl = c.imageUrl;
        let solutionImage = c.solution?.imageUrl;

        if(c.imageFile) {
          imageUrl = await uploadFile.mutateAsync(c.imageFile)
        }
        if(c.solution?.imageFile){
          solutionImage = await uploadFile.mutateAsync(c.solution.imageFile)
        }

        return {
          questionId: c.questionId,
          question: c.question ?? "",
          image: imageUrl ?? "",
          options: c.options ?? [],
          correctAnswer: c.answer ?? "",
          difficulty: c.difficulty ?? "",
          solution: {
            explanation: c.solution?.explanation ?? "",
            text: c.solution?.text ?? "",
            image: solutionImage ?? "",
            video: c.solution?.video ?? ""
          }
        }
      })
    );

    const adjustedData: EditQuizRequest = {
      quizId: details?.data.data.quizId ?? null,
      quizName: form.watch("quizName"),
      questions: uploadedContent,
      difficulty: form.watch("difficulty"),
      grade: form.watch("grade")
    };

    // console.log(adjustedData);
    editQuiz.mutate(adjustedData, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  };

  return (
    <div className="w-full p-3">
      <div className="flex flex-col w-full mb-5">
        <div className="flex flex-row justify-between">
          <p>{`Edit ${decodedTitle}`}</p>
          <XIcon className="cursor-pointer" onClick={() => navigate(-1)} />
        </div>
        <hr className="w-full my-2 border-gray-300" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <Label>Quiz Name</Label>
          <Input
            id="quizName"
            className="border border-gray-300 bg-white"
            placeholder="Test"
            onChange={(e) => {
              form.setValue("quizName", e.target.value);
            }}
            value={form.watch("quizName")}
          />
        </div>
        <div>
          <InputSelect
            onChange={(value) => {
                form.setValue("difficulty", value?.value ?? "");
            }}
            handleSearch={setSearchProf}
            options={optionProficiency.data?.data.data.map((item) => (
                {
                  meaning: item.name,
                  value: item.id
                }
            ))}
            name="proficiency"
            label="Select Difficulty"
            required
            value={form.watch("difficulty")}
          />
        </div>
        <div>
          <InputSelect
            onChange={(value) => {
                form.setValue("grade", value?.value ?? "");
            }}
            handleSearch={setSearchGrade}
            options={optionGrade.data?.data.data.map((item) => (
              {
                meaning: item.id,
                value: item.name
              }
            ))}
            name="grade"
            label="Select Grade"
            required
            value={form.watch("grade")}
          />
        </div>

        {sections.map((section) => (
          <div
            key={section.id}
            className="flex flex-col w-full mt-3 p-3 border border-gray-300 rounded-md bg-white"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-4 items-center">
                <p className="font-medium">{`Topic Content ${section.id}`}</p>
                <Trash2Icon
                  size={18}
                  className="cursor-pointer"
                  onClick={() => handleDeleteSection(section.id)}
                />
              </div>
              {section.isOpen ? (
                <ChevronDown
                  className="cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                />
              ) : (
                <ChevronRight
                  className="cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                />
              )}
            </div>
            <hr className="w-full my-2 border-gray-300" />
            {section.isOpen && (
              <div className="flex flex-col gap-3">
                <div>
                  <InputSelect
                    onChange={(val) =>
                      setContentData((prev) =>
                        prev.map((c) =>
                          c.id === section.id ? { ...c, difficulty: val?.value} : c
                        ))
                    }
                    handleSearch={setSearchProf}
                    options={optionProficiency.data?.data.data.map((item) => (
                      {
                        meaning: item.name,
                        value: item.id
                      }
                    ))}
                    name="proficiency"
                    label="Select Difficulty"
                    required
                    value={contentData[section.id-1]?.difficulty}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Question</Label>
                  <Input
                    id="text"
                    className="border border-gray-300 bg-white"
                    placeholder="Test"
                    onChange={(e) => {
                      setContentData((prev) =>
                        prev.map((c) =>
                          c.id === section.id ? { ...c, question: e.target.value } : c
                        )
                      )
                    }}
                    value={contentData[section.id-1]?.question}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Image Content</Label>
                  <Dropzone
                    multiple={false}
                    onDrop={(files) => {
                      const file = files[0];
                      setContentData((prev) =>
                        prev.map((c) => (c.id === section.id ? { ...c, imageFile: file } : c))
                      );
                    }}
                    initialFiles={initialFilesMap[section.id] || []}
                  />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Options (max 4)</Label>
                    <ul className="flex flex-wrap gap-2">
                        {(contentData.find((c) => c.id === section.id)?.options ?? []).map((option, index) => (
                        <li
                            key={index}
                            className="bg-gray-100 text-sm px-2 py-1 rounded flex items-center gap-1"
                        >
                            {option}
                            <XIcon
                            size={14}
                            className="cursor-pointer text-red-500"
                            onClick={() => handleDeleteOption(section.id, index)}
                            />
                        </li>
                        ))}
                    </ul>

                    {((contentData.find((c) => c.id === section.id)?.options?.length ?? 0) +
                        (newOption[section.id]?.length ?? 0)) < 5 && (
                        <div className="flex flex-col gap-2">
                            {(newOption[section.id] && newOption[section.id].length > 0) && (
                                newOption[section.id].map((input, inputIndex) => (
                                    <div className="flex gap-2 items-center" key={inputIndex}>
                                        <Input
                                        className="border border-gray-300 bg-white"
                                        placeholder="Type new option"
                                        value={input}
                                        onChange={(e) =>
                                            setNewOption((prev) => ({
                                            ...prev,
                                            [section.id]: (prev[section.id] ?? []).map((val, idx) =>
                                                idx === inputIndex ? e.target.value : val
                                            ),
                                            }))
                                        }
                                        />
                                        <XIcon
                                        size={14}
                                        className="cursor-pointer text-red-500"
                                        onClick={() =>
                                            setNewOption((prev) => ({
                                            ...prev,
                                            [section.id]: (prev[section.id] ?? []).filter((_, idx) => idx !== inputIndex),
                                            }))
                                        }
                                        />
                                    </div>
                                ))
                            )}
                            <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                setNewOption((prev) => ({
                                    ...prev,
                                    [section.id]: [...(prev[section.id] ?? []), ""],
                                }))
                                }
                                disabled={
                                (contentData?.find((c) => c.id === section.id)?.options?.length ?? 0) +
                                    (newOption[section.id]?.length ?? 0) >= 4
                                }
                            >
                                + Add Option Input
                            </Button>

                            <Button
                                type="button"
                                onClick={() => {
                                const validOptions = (newOption[section.id] ?? []).map((v) => v.trim()).filter(Boolean);
                                if (validOptions.length > 0) {
                                    setContentData((prev) =>
                                    prev.map((item) =>
                                        item.id === section.id
                                        ? {
                                            ...item,
                                            options: [...(item.options ?? []), ...validOptions].slice(0, 4),
                                            }
                                        : item
                                    )
                                    );
                                    setNewOption((prev) => ({ ...prev, [section.id]: [] }));
                                }
                                }}
                                disabled={!(newOption[section.id]?.some((v) => v.trim()))}
                            >
                                ✓ Submit Options
                            </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                  <Label>Answer</Label>
                  <Input
                    id="text"
                    className="border border-gray-300 bg-white"
                    placeholder="Test"
                    onChange={(e) => setContentData((prev) =>
                      prev.map((c) => (c.id === section.id ? { ...c, answer: e.target.value } : c))
                    )}
                    value={contentData[section.id-1]?.answer}
                  />
                </div>

                <div
                  className="flex flex-col w-full mt-3 p-3 gap-2 border border-gray-300 rounded-md bg-white"
                >
                  <div>
                    <div className="flex flex-row justify-between">
                      <p>Solution</p>
                    </div>
                    <hr className="w-full my-2 border-gray-300" />
                  </div>
                  <div className="flex flex-col">
                    <Label>Explanation</Label>
                    <Input
                      id="text"
                      className="border border-gray-300 bg-white"
                      placeholder="Test"
                      onChange={(e) =>
                        setContentData((prev) =>
                          prev.map((c) => (c.id === section.id ? { ...c, solution: {
                            ...c.solution,
                            explanation: e.target.value,
                          }} : c))
                        )
                      }
                      value={contentData[section.id-1]?.solution?.explanation}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label>Text Content</Label>
                    <Input
                      id="text"
                      className="border border-gray-300 bg-white"
                      placeholder="Test"
                      onChange={(e) =>
                        setContentData((prev) =>
                          prev.map((c) => (c.id === section.id ? { ...c, solution: {
                            ...c.solution,
                            text: e.target.value,
                          }} : c))
                      )}
                      value={contentData[section.id-1]?.solution?.text}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label>Image Content</Label>
                    <Dropzone
                      multiple={false}
                      onDrop={(files) => {
                        const file = files[0];
                        setContentData((prev) =>
                          prev.map((c) => (c.id === section.id ? { ...c, solution: {
                            ...c.solution,
                            imageFile: file }} : c))
                        );
                      }}
                      initialFiles={initialSolutionMap[section.id] || []}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label>Video Content</Label>
                    <Input
                      id="text"
                      className="border border-gray-300 bg-white"
                      placeholder="Test"
                      onChange={(e) => {
                        setContentData((prev) =>
                          prev.map((c) => (c.id === section.id ? { ...c, solution: {
                            ...c.solution,
                            video: e.target.value,
                          }} : c)))
                      }}
                      value={contentData[section.id-1]?.solution?.video}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-5">
          <Button
            onClick={handleAddSection}
            // className="w-fit bg-blue-500 text-white px-4 py-2 rounded mt-2"
            // type="button"
          >
            Add More
          </Button>

          <Button
            onClick={() => {
              handleSave();
              onClose?.();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
