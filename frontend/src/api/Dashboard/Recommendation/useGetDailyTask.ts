import { useQuery } from "@tanstack/react-query";
import api from "../../axios";


interface QuizDetail {
    questionId: string;
    question: string;
    image: string;
    options: string[] | null;
    difficulty: string;
}

export default function useGetDailyTask(userId: string, userGrade: string, userDifficulty: string) {
    return useQuery({
        queryKey: ["user_recommendation", userId, userGrade, userDifficulty],
        queryFn: async () => {
          const response = await api.get<BaseResponse<QuizDetail[]>>(`/dailyTask`, {
            params: { userId,userGrade,userDifficulty },
            withCredentials: true,
          });
          return response.data;
        },
      //   enabled: !!userId,
        retry: false
      });
}