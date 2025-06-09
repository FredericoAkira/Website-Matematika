import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number;
    data: {
        studentName: string,
        accessedMaterials: {
            materialName: string,
            difficulty: string,
            grade: string
        }[],
        accessedQuizzes: {
            quizId: string,
            quizName: string,
            difficulty: string,
            grade: string,
            progress: number,
            latestScore: number,
            averageScore: number,
        }[]
    }
    message: string;
    status: string;
}

export default function useGetStudentDetail(
    studentId: string,
) {
    return useQuery({
      queryKey: ["student_detail", studentId],
      queryFn: async () => {
        const response = await api.get<Response>(`/getStudentDetail`, {
          params: { studentId  },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}