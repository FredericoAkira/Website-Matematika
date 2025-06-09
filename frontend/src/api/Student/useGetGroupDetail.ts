import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number;
    data: {
        groupName: string;
        students: {
            studentId: string,
            studentName: string,
            level: string,
            grade: string
        }[],
    }
    message: string;
    status: string;
}

export default function useGetGroupDetail(
    groupId: string,
) {
    return useQuery({
      queryKey: ["student_detail", groupId],
      queryFn: async () => {
        const response = await api.get<Response>(`/groupDetail`, {
          params: { groupId  },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}