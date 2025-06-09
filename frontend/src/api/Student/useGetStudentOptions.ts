import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number;
    data: {
        studentId: string,
        studentName: string,
        level: string,
        grade: string
    }[]
    message: string;
    status: string;
}

export default function useGetStudentOption(
    teacherId: string,
    searchValue: string,
) {
    return useQuery({
      queryKey: ["student_option", teacherId, searchValue],
      queryFn: async () => {
        const response = await api.get<Response>(`/studentOption`, {
          params: { teacherId, searchValue  },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}