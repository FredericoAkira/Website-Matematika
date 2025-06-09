import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number,
    status: string,
    message: string,
    data: {
        groupId: string;
        groupName: string;
        students: {
            label: string,
            value: string
        }[]
    }[]
}

export default function useGetGroupList(teacherId: string) {
    return useQuery({
        queryKey: ["group_list", teacherId],
        queryFn: async () => {
            const response = await api.get<Response>(`/getGroup`, {
                params: { teacherId },
                withCredentials: true,
            });
            return response.data;
        },
        keepPreviousData: true,
        retry: false
    });
}