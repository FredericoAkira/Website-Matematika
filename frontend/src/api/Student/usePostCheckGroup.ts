import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AddGroupRequest {
    groupName: string;
    teacherId: string;
    studentIds: string[];
}

interface Response {
    code: number,
    data: string,
    message: string,
    status: string
}

export default function usePostCheckGroup() {
    return useMutation({
        mutationKey: ["check_Group"],
        mutationFn: async (request: AddGroupRequest) => {
            const response = await api.post<Response>("/checkGroup", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}