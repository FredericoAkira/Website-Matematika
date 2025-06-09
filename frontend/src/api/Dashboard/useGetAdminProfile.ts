import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface AdminProfile {
    username: string;
    profilePhoto: string;
    email: string;
    grade: string;
}

export default function useGetAdminProfile(userId: string) {
    return useQuery({
        queryKey: ["admin_profile", userId],
        queryFn: async () => {
          const response = await api.get<BaseResponse<AdminProfile>>(`/adminData`, {
            params: { userId },
            withCredentials: true,
          });
          return response.data;
        },
      //   enabled: !!userId,
        retry: false
      });
}