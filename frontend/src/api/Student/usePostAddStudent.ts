import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AddStudentRequest {
    teacherId: string;
    studentIds: string[];
}

export default function usePostAddStudent() {
    return useMutation({
        mutationKey: ["add_Student"],
        mutationFn: async (request: AddStudentRequest) => {
            const response = await api.post<Response>("/addStudent", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}