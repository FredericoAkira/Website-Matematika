import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AddMaterialRequest {
    userId: string;
    material: {
        materialName: string;
        description: string;
        backgroundImg: string;
        grade: string;
        topics: string[];
        quizzes: string[];
        difficulty: string;
    }
}

export default function usePostAddMaterial() {
    return useMutation({
        mutationKey: ["add_Material"],
        mutationFn: async (request: AddMaterialRequest) => {
            const response = await api.post<Response>("/admin/addMaterial", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}