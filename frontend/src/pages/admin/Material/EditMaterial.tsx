/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useGetDetailMaterial from "../../../api/Material/useGetDetailMaterial";
import usePostEditMaterial, { EditMaterialRequest } from "../../../api/Material/usePostEditMaterial";
import usePostCheckTopic from "../../../api/Topic/usePostCheckTopic";
import useGetLOV from "../../../api/useGetLOV";
import { Button } from "../../../component/Button/button";
import { Dropzone } from "../../../component/Dropzone";
import { Student } from "../../../component/helper";
import { Input } from "../../../component/InputField/input";
import { Textarea } from "../../../component/InputField/textArea";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { Label } from "../../../component/Label";
import AddMore from "../../user/ManageStudent/AddMore";

interface IMaterialForm {
    onClose?: () => void;
    refetch?: () => void;
}

export const EditMaterial: React.FC<IMaterialForm> = ({
    onClose
}) => {
    const form = useForm();
    const navigate = useNavigate();
    const editMaterial = usePostEditMaterial();
    const [searchValue, setSearchValue] = useState("")
    const [dataTopic, setDataTopic] = useState<Student[]>([]);
    const [dataQuiz, setDataQuiz] = useState<Student[]>([]);
    const optionGrade = useGetLOV();
    const { materialName } = useParams();
    const decodedTitle = decodeURIComponent(materialName || "");
    const {data: details} = useGetDetailMaterial(decodedTitle);
    const [searchProf, setSearchProf] = useState<string>("");
    const optionProficiency = useGetLOV();
    const uploadFile = usePostCheckTopic();

    useEffect(() => {
        optionGrade.mutate({
            type: "gradelov",
            search: searchValue
        })
    }, [searchValue]);

    useEffect(() => {
        optionProficiency.mutate({
            type: "levellov",
            search: searchProf
        })
    }, [searchProf]);

    useEffect(() => {
        const setFormValues = async () => {
            const remote = details?.data.data;
            if (remote) {
                form.setValue("materialName", remote.materialName);
                form.setValue("description", remote.description);
                form.setValue("grade", remote.grade);
                form.setValue("difficulty", remote.difficulty);
    
                if (remote.backgroundImg) {
                    const blob = await fetch(remote.backgroundImg).then(r => r.blob());
                    const file = new File([blob], `img-${remote.materialName}`, { type: blob.type });
                    form.setValue("bg", Object.assign(file, { preview: remote.backgroundImg }));
                }
    
                setDataTopic(remote.topics);
                setDataQuiz(remote.quizzes);
            }
        };
    
        setFormValues();
    }, [details?.data.data, form]);

    const handleSave = async () => {
        let bgUrl = "";
        if(form.getValues("bg")){
            bgUrl = await uploadFile.mutateAsync(form.watch("bg"));
        }
        const adjustedData: EditMaterialRequest = {
            materialId: details?.data.data.materialId ?? "",
            materialName: form.watch("materialName"),
            description: form.watch("description"),
            backgroundImage: bgUrl,
            grade: form.watch("grade"),
            topics: dataTopic.map((item) => item.id?.toString() ?? ""),
            quizzes: dataQuiz.map((item) => item.id?.toString() ?? ""),
            difficulty: form.watch("difficulty")
        }
        editMaterial.mutate(adjustedData,{
            onSuccess: () => {
                navigate(-1)
            }
        })
    }

    const handleRemoveTopics = (e: any, index: number) => {
        e.preventDefault();
        setDataTopic((prevAttendees: any) =>
          prevAttendees.filter((_: any, i: number) => i !== index),
        );
    };

    const handleRemoveQuizzes = (e: any, index: number) => {
        e.preventDefault();
        setDataQuiz((prevAttendees: any) =>
          prevAttendees.filter((_: any, i: number) => i !== index),
        );
    };

    console.log(form.watch("bg"))

    return (
        <div className="relative mr-5 overflow-y-hidden mb-3">
            <div className="flex flex-col w-full items-center justify-between border-solid bg-white/70 rounded-lg p-5 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3">
                <div className="w-full">
                    <div className="flex flex-col w-full mb-5">
                            <div className="flex flex-row justify-between">
                                <p>{`Edit ${decodedTitle}`}</p>
                                <XIcon className="cursor-pointer" onClick={() => navigate(-1)} />
                            </div>
                            <hr className="w-full my-2 border-gray-300" />
                    </div>

                    <div className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <Label>Material Name</Label>
                                <Input
                                    id="materialName"
                                    className="border border-gray-300 bg-white"
                                    placeholder="Test"
                                    onChange={(e) => {
                                        form.setValue("materialName", e.target.value)
                                    }}
                                    value={form.watch("materialName")}
                                />
                            </div>

                            <div className="flex flex-col">
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

                            <div className="flex flex-col">
                                <Label>Description</Label>
                                <Textarea
                                    id="description"
                                    className="border border-gray-300 bg-white"
                                    placeholder="Description"
                                    onChange={(e) => {
                                        form.setValue("description", e.target.value)
                                    }}
                                    value={form.watch("description")}
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label>Background Image</Label>
                                <Dropzone
                                    multiple={false}
                                    onDrop={(files) => {
                                        const file = files[0];
                                        form.setValue("bg", file);
                                    }}
                                    initialFiles={form.watch("bg") ? [form.watch("bg")] : []}
                                    deleteable
                                />
                            </div>

                            <InputSelect
                                onChange={(value) => {
                                    form.setValue("grade", value?.value ?? "");
                                }}
                                handleSearch={setSearchValue}
                                options={optionGrade.data?.data.data.map((item) => (
                                    {
                                        meaning: item.id,
                                        value: item.name
                                    }
                                ))}
                                name="grade"
                                label="Grade"
                                required
                                value={form.watch("grade")}
                            />

                            <div className="flex flex-col">
                                <Label>Topics</Label>
                                <AddMore
                                    dataAttendee={dataTopic}
                                    setDataAttendee={setDataTopic}
                                    handleRemoveAttendee={handleRemoveTopics}
                                    text="Add Topics"
                                    type="topic"
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label>Quizzes</Label>
                                <AddMore
                                    dataAttendee={dataQuiz}
                                    setDataAttendee={setDataQuiz}
                                    handleRemoveAttendee={handleRemoveQuizzes}
                                    text="Add Quizzes"
                                    type="quiz"
                                />
                            </div>
                    </div>
                    <div className="flex justify-end mt-5">
                            <Button onClick={() => {
                                handleSave()
                                onClose?.()
                            }}>
                                Save
                            </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}