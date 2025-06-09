/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import usePostAddMaterial, { AddMaterialRequest } from "../../../api/Material/usePostAddMaterial";
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
    source: string;
    onClose?: () => void;
    refetch?: () => void;
}

const materialSchema = z.object({
    materialName: z.string()
        .min(1, "Username tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Username mengandung karakter yang tidak diperbolehkan",
        }),
    description: z.string()
        .min(1, "Username tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Username mengandung karakter yang tidak diperbolehkan",
        }),
    bg: z.any(),
        // .min(1, "Username tidak boleh kosong")
        // .regex(/^[a-zA-Z0-9?!@"_]+$/, {
        //     message: "Username mengandung karakter yang tidak diperbolehkan",
        // }),
    grade: z.string()
        .min(1, "Username tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Username mengandung karakter yang tidak diperbolehkan",
        }),
    difficulty: z.string()
        .min(1, "Password tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Password mengandung karakter yang tidak diperbolehkan",
        }),
});

export const MaterialForm: React.FC<IMaterialForm> = ({
    source,
    onClose,
    refetch
}) => {
    const form = useForm<z.infer<typeof materialSchema>>({
        resolver: zodResolver(materialSchema),
        defaultValues: {
            materialName: "",
            description: "",
            grade: "",
            difficulty: ""
        }
    });
    const userId = localStorage.getItem("user") ?? "";
    const addMaterial = usePostAddMaterial();
    const [searchValue, setSearchValue] = useState("")
    const [dataTopics, setDataTopics] = useState<Student[]>([]);
    const [dataQuiz, setDataQuiz] = useState<Student[]>([]);
    const optionGrade = useGetLOV();
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

    const handleSave = async () => {
        let bgUrl = "";
        if(form.getValues("bg")){
            bgUrl = await uploadFile.mutateAsync(form.watch("bg"));
        }

        const adjustedData: AddMaterialRequest = {
            userId: userId,
            material: {
                materialName: form.watch("materialName"),
                description: form.watch("description"),
                backgroundImg: bgUrl,
                grade: form.watch("grade"),
                topics: dataTopics.map((item) => item.id?.toString() ?? ""),
                quizzes: dataQuiz.map((item) => item.id?.toString() ?? ""),
                difficulty: form.watch("difficulty")
            }
        }
        // console.log(adjustedData)
        addMaterial.mutate(adjustedData,{
            onSuccess: () => {
                refetch?.()
                console.log("Success")
            }
        })
    }

    const handleRemoveTopics = (e: any, index: number) => {
        e.preventDefault();
        setDataTopics((prevAttendees: any) =>
          prevAttendees.filter((_: any, i: number) => i !== index),
        );
    };

    const handleRemoveQuizzes = (e: any, index: number) => {
        e.preventDefault();
        setDataQuiz((prevAttendees: any) =>
          prevAttendees.filter((_: any, i: number) => i !== index),
        );
    };

    return (
        <div className="w-full p-3">
            <div className="flex flex-col w-full mb-5">
                <div className="flex flex-row justify-between">
                    <p>{`${source} Material`}</p>
                    <XIcon className="cursor-pointer" onClick={onClose} />
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
                    value={form.watch("grade")}
                    required
                />

                <div className="flex flex-col">
                    <Label>Topics</Label>
                    <AddMore
                        dataAttendee={dataTopics}
                        setDataAttendee={setDataTopics}
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
    )
}