import { useQuery } from "@tanstack/react-query";
import api from "../../axios";

export interface NotificationResponse {
    notifId: string;
    header: string;
    content: string;
    senderName: string;
    status: string;
}

export default function useGetNotification(userId: string) {
    return useQuery({
        queryKey: ["get_notification", userId],
        queryFn: async () => {
          const response = await api.get<BaseResponse<NotificationResponse[]>>(`/notification`, {
            params: { userId },
            withCredentials: true,
          });
          return response.data;
        },
      //   enabled: !!userId,
        retry: false
      });
}