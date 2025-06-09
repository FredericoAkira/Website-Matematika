import { useQuery } from "@tanstack/react-query";
import api from "../../axios";


export interface UserProfile {
    title: string;
    description: string;
    background?: string;
}

export default function useGetRecommendation(userId: string) {
    return useQuery({
        queryKey: ["user_recommendation", userId],
        queryFn: async () => {
          const response = await api.get<UserProfile[]>(`/recommendation`, {
            params: { userId },
            withCredentials: true,
          });
          return response.data;
        },
      //   enabled: !!userId,
        retry: false
      });
}