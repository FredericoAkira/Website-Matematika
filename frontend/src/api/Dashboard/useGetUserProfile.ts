import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface UserProfile {
    username: string;
    profilePhoto: string;
    email: string;
    level: string;
    exp: number;
    grade: string;
    streak: number;
}

export default function useGetUserProfile(userId: string) {
    return useQuery({
        queryKey: ["user_profile", userId],
        queryFn: async () => {
          const response = await api.get<BaseResponse<UserProfile>>(`/userData`, {
            params: { userId },
            withCredentials: true,
          });
          return response.data;
        },
      //   enabled: !!userId,
        retry: false
      });
}