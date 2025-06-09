import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface EditMaterialRequest {
    materialId: string;
    materialName: string;
    description: string;
    backgroundImage: string;
    grade: string;
    topics: string[];
    quizzes: string[];
    difficulty: string;
}

export default function usePostEditMaterial() {
    return useMutation({
        mutationKey: ["add_Material"],
        mutationFn: async (request: EditMaterialRequest) => {
            const response = await api.put<Response>("/admin/editMaterial", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}