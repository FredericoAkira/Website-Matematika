import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
  code: number;
  data: {
    doDaily: boolean
    latestMaterial: {
      materialName: string,
      difficulty: string,
      grade: string
    }
    latestQuiz: {
      quizName: string,
      grade: string,
      progress: number,
      difficulty: string,
      materialName: string
    }
    materialChart: {
      label: string,
      value: string
    }[]
    quizChart: {
      label: string,
      value: string
    }[]
    studentList: {
      studentName: string,
      grade: string
    }[]
  }
  message: string;
  status: string;
}

export default function useGetDetail(userId: string, quizParam: string, materialParam: string) {
    return useQuery({
      queryKey: ["user_detail", userId, quizParam, materialParam],
      queryFn: async () => {
        const response = await api.get<Response>(`/user`, {
          params: { userId, quizParam, materialParam },
          withCredentials: true,
        });
        return response.data;
      },
    //   enabled: !!userId,
      retry: false
    });
}