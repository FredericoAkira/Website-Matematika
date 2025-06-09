import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface DashboardDetail {
    materialChart: {
        value: string;
        label: string;
    }[]
    topicChart: {
      value: string;
      label: string;
    }[]
    quizChart: {
        value: string;
        label: string;
    }[]
    latestMaterial: string;
    latestTopic: string;
    latestQuiz: string;
    userData: {
      totalUser: string;
      student: {
        label: string;
        value: string;
      }[];
      teacher: {
        label: string;
        value: string;
      }[];
    }
}

export default function useGetDataAdmin(
  userId: string,
  filterMaterial?: string,
  filterTopic?: string,
  filterQuiz?: string,
  filterStudent?: string
) {
    return useQuery({
        queryKey: ["admin_dashboard", userId, filterMaterial, filterQuiz, filterTopic, filterStudent],
        queryFn: async () => {
          const response = await api.get<BaseResponse<DashboardDetail>>(`/admin/dashboardData`, {
            params: { userId, filterMaterial, filterQuiz, filterTopic, filterStudent},
            withCredentials: true,
          });
          return response.data;
        },
      //   enabled: !!userId,
        retry: false
      });
}