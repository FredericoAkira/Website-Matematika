import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface StudentRequest {
    teacherId: string;
    studentId: string;
}

export default function usePostDeleteStudent() {
    return useMutation({
        mutationKey: ["delete_Student"],
        mutationFn: async (request: StudentRequest) => {
            const response = await api.delete(`/deleteStudent/${request.teacherId}/${request.studentId}`, {
                withCredentials: true
            });
            return response.data;
        }
    })
}