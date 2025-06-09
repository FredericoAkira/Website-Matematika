import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface EditGroupRequest {
    groupId: string;
    groupName: string;
    teacherId: string;
    studentIds: string[];
}

export default function usePostEditGroup() {
    return useMutation({
        mutationKey: ["edit_Group"],
        mutationFn: async (request: EditGroupRequest) => {
            const response = await api.post<Response>("/editGroup", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}