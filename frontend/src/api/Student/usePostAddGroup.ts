import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AddGroupRequest {
    groupName: string;
    teacherId: string;
    studentIds: string[];
}

export default function usePostAddGroup() {
    return useMutation({
        mutationKey: ["add_Group"],
        mutationFn: async (request: AddGroupRequest) => {
            const response = await api.post<Response>("/addGroup", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}