import { useQuery } from "@tanstack/react-query";
import api from "./axios";

export default function useGetLevelCap(gradeParam: string) {
  return useQuery({
    queryKey: ["level_cap", gradeParam],
    queryFn: () => {
      const response = api.get(`/levelCap`, {
        params: { gradeParam },
        withCredentials: true,
      });
      return response;
    },
    retry: false,
  });
}
